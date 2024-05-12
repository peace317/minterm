import { BrowserWindow, IpcMainEvent, ipcMain } from "electron";
import { error } from "electron-log";
import Store from "electron-store";
import {
  DataPointType,
  StoreKey,
  ParserType,
  IPCChannelType,
  ConnectionStatusType,
} from "@minterm/types";
import { asciiToBin, asciiToDecimal, asciiToHex } from "@minterm/services";
import {
  ByteLengthParser,
  DelimiterParser,
  ReadyParser,
  RegexParser,
  SerialPort,
} from "serialport";
import { isDevelopment } from "./index";

export default class SerialPortListener {
  serialPortConnection: SerialPort | undefined;

  mainWindow: BrowserWindow;

  conversionSupport: boolean;

  store: Store;

  constructor(mainWindow: BrowserWindow, store: Store<any>) {
    this.mainWindow = mainWindow;
    this.store = store;
    this.serialPortConnection = undefined;
    this.conversionSupport = false;
  }

  init(): void {
    ipcMain.on(IPCChannelType.SEND_DATA, (event, args) =>
      this.sendData(event, args)
    );
    ipcMain.on(IPCChannelType.PORT_STATUS, (event, args) =>
      this.portStatusType(event, args)
    );
    ipcMain.on(IPCChannelType.PARSER_SUPPORT_CONVERSION, (event, args) =>
      this.doesParserSupportConversion(event, args)
    );
    ipcMain.on(IPCChannelType.PORT_DISCONNECT, (event, args) =>
      this.disconnect(event, args)
    );
    ipcMain.on(IPCChannelType.PORT_CONNECT, (event, args) =>
      this.connect(event, args)
    );
    this.sendPortList();
  }

  public portStatusType(event: IpcMainEvent, args: any): void {
    const showStatusMessage = args !== undefined ? (args as boolean) : false;

    const portStatus = this.checkPortStatus();

    if (showStatusMessage) {
      this.mainWindow.webContents.send(IPCChannelType.PORT_STATUS, portStatus);
    }
    event.returnValue = portStatus;
  }

  /**
   * Opens a connection with the serialport. Except the baud rate and the port,
   * every setting stored in electron will be applied. This includes all settings
   * for the connection itself (dataBits, stopBits etc.) as well as the parser.
   *
   * If a connection could not be opened, an error/warning message will be send to the
   * renderer (Channel: PORT_STATUS). For further detail, error messages are logged as well.
   *
   * @param event Event for replying the status code of the opened connection
   * @param args Arguments should contain the selected serialport and the baud rate
   */
  public connect(event: IpcMainEvent, args: any[]): void {
    if (args.length < 2) {
      error(`Not enough arguments given for connection: ${args}`);
    }
    const port = args[0] as string;
    const baudRate = args[1] as string;
    if (port === undefined) {
      event.reply(
        IPCChannelType.PORT_STATUS,
        ConnectionStatusType.NO_PORT_SELECTED
      );
      return;
    }
    if (baudRate === undefined) {
      event.reply(
        IPCChannelType.PORT_STATUS,
        ConnectionStatusType.NO_BAUD_RATE_SELECTED
      );
      return;
    }
    if (
      this.serialPortConnection !== undefined &&
      this.serialPortConnection.isOpen
    ) {
      event.reply(
        IPCChannelType.PORT_STATUS,
        ConnectionStatusType.PORT_ALREADY_OPEN
      );
      return;
    }

    try {
      const dataBits: any = this.store.get(StoreKey.SERIALPORT_DATA_BITS);
      const stopBits: any = this.store.get(StoreKey.SERIALPORT_STOP_BITS);
      const parity: any = this.store.get(StoreKey.SERIALPORT_PARITY);
      // opens immediately a port
      this.serialPortConnection = new SerialPort(
        {
          path: port,
          baudRate: Number(baudRate),
          dataBits,
          stopBits,
          parity,
          lock: Boolean(this.store.get(StoreKey.SERIALPORT_LOCK)),
          hupcl: Boolean(this.store.get(StoreKey.SERIALPORT_HUPCL)),
          rtscts: Boolean(this.store.get(StoreKey.SERIALPORT_RTSCTS)),
          xany: Boolean(this.store.get(StoreKey.SERIALPORT_XANY)),
          xoff: Boolean(this.store.get(StoreKey.SERIALPORT_XOFF)),
          xon: Boolean(this.store.get(StoreKey.SERIALPORT_XON)),
        },
        (error) => {
          if (error) {
            console.error(`[New SerialPort] - ${error}`);
            event.reply(
              IPCChannelType.PORT_STATUS,
              ConnectionStatusType.PORT_ALREADY_OPEN
            );
          }
        }
      );

      // setting up 'open' event with a flushed port
      this.serialPortConnection.on("open", (error) => {
        if (error) {
          console.error(`[Open SerialPort] - ${error}`);
          return;
        }
        this.serialPortConnection?.flush((error) => {
          if (error) {
            console.error(`[Flush SerialPort] - ${error}`);
            return;
          }
          const parser = this.getParser();
          if (parser !== undefined) {
            const consumer = this.serialPortConnection?.pipe(parser);
            consumer?.on("data", (buf) =>
              this.buildSequenceWithConversion(buf)
            );
          }
        });
      });
    } catch (error) {
      // catch and log any unexpected errors
      console.error(`[SerialPort unexpected error] - ${error}`);
    }
  }

  /**
   * Disconnects the serialport after a flush. A Flush discards
   * data received but not read, and written but not transmitted by the operating system,
   * thus closing will not result in an error.
   */
  public disconnect(event: IpcMainEvent, args: any[]): void {
    if (
      this.serialPortConnection !== undefined &&
      this.serialPortConnection.isOpen
    ) {
      this.serialPortConnection?.flush();
      this.serialPortConnection?.close(function (err: any) {
        if (err != null) {
          console.error(`[Close SerialPort] - ${err}`);
        }
      });
    }
  }

  /**
   * Sends data to the appropriate seriaport. If no connection is open or
   * the serialport is not writable, a message is send to the renderer (Channel: PORT_STATUS).
   * The message to be sended will also be resend to the renderer (Channel: SEND_DATA).
   *
   * @param event
   * @param args
   * @returns
   */
  public sendData(event: IpcMainEvent, args: any[]): void {
    const message: string = args[0];
    if (
      this.serialPortConnection === undefined ||
      !this.serialPortConnection.isOpen
    ) {
      this.mainWindow.webContents.send(
        IPCChannelType.PORT_STATUS,
        ConnectionStatusType.DISCONNECTED
      );
      return;
    }
    if (!this.serialPortConnection.writable) {
      this.mainWindow.webContents.send(
        IPCChannelType.PORT_STATUS,
        ConnectionStatusType.PORT_NOT_WRITABLE
      );
      return;
    }
    // sends message
    this.serialPortConnection.write(message, "ascii", (err) => {
      if (err) {
        return console.error(`[Write on SerialPort] - ${err}`);
      }
    });
    const timestamp = new Date();
    const points = message.split("").map(
      (e) =>
        <DataPointType>{
          timestamp,
          value: e,
          valueAsBin: asciiToBin(e),
          valueAsDec: asciiToDecimal(e),
          valueAsHex: asciiToHex(e),
        }
    );
    if (isDevelopment) {
      console.log("Send message point ${points}", points);
    }
    // Send back for displaying send data
    this.mainWindow.webContents.send(IPCChannelType.SEND_DATA, points);
  }

  /**
   * Checks, if the selected parser supports an converion between system values (bin to ascii etc.).
   * This relevant for displaying data correctly. Only parser with 8 bit data transformation are allowed.
   * @param event
   * @param args
   */
  public doesParserSupportConversion(event: IpcMainEvent, args: any[]): void {
    this.mainWindow.webContents.send(
      IPCChannelType.PARSER_SUPPORT_CONVERSION,
      this.doesSelectedParserSupportConversion()
    );
  }

  /**
   * Determines dependent on the selected parser, if a conversion support exists. For visual reasons,
   * conversion should be only supported, when the parser delimits single byte values.
   *
   * Value will not be updated, if an open connection exists, because a new parser could be selected
   * during running serialport.
   *
   * @param parser optional parser, if determined before
   * @returns
   */
  private doesSelectedParserSupportConversion(parser?: any) {
    // Do not change state of conversion on open connection
    if (this.serialPortConnection?.isOpen) return this.conversionSupport;

    this.conversionSupport = false;
    const selectedParser = parser !== undefined ? parser : this.getParser();
    if (
      (selectedParser instanceof ByteLengthParser &&
        selectedParser.length === 1) ||
      this.store.get(StoreKey.FORCE_BYTE_DELIMITER)
    ) {
      this.conversionSupport = true;
    }
    return this.conversionSupport;
  }

  /**
   * Determines and builds a parser with the stored settings. Every parser
   * has a different approach to parse the incoming data from the serialport
   * and transforms this data.
   *
   * @returns parser for serialport
   */
  private getParser() {
    const parser = this.store.get(StoreKey.SELECTED_PARSER);
    switch (parser) {
      case ParserType.BYTE_LENGTH_PARSER:
        return new ByteLengthParser({
          length: this.store.get(StoreKey.PARSER_BYTE_LENGTH) as number,
        });
      case ParserType.DELIMITER_PARSER:
        return new DelimiterParser({
          delimiter: this.unescapeSpecialCharacter(
            this.store.get(StoreKey.PARSER_DELIMITER) as string
          ),
          includeDelimiter: Boolean(
            this.store.get(StoreKey.PARSER_INCLUDE_DELIMITER)
          ),
        });
      case ParserType.REGEX_PARSER:
        return new RegexParser({
          regex: new RegExp(
            this.store.get(StoreKey.PARSER_BYTE_LENGTH) as string
          ),
          encoding: this.store.get(
            StoreKey.PARSER_REGEX_ENCODING
          ) as BufferEncoding,
        });
      case ParserType.READY_PARSER:
        return new ReadyParser({
          delimiter: this.store.get(StoreKey.READY_PARSER_DELIMITER) as string,
        });
      default:
        console.error(`[Unknown parser] - ${parser}`);
        break;
    }
    return undefined;
  }

  /**
   * Builds a data point object with the actual string value of the parser sequence and a
   * timestamp for receipt time. Additionally, the value will be converted to binary, decimal,
   * and hexadecimal.
   *
   * @param buffer
   */
  private buildSequenceWithConversion(buffer: Buffer) {
    if (this.store.get(StoreKey.FORCE_BYTE_DELIMITER)) {
      Buffer.from(buffer)
        .toString("binary")
        .split("")
        .forEach((e) => {
          const point = this.buildDataPoint(e);
          this.mainWindow.webContents.send(IPCChannelType.RECEIVE_DATA, point);
        });
    } else {
      const buf = Buffer.from(buffer).toString("binary");
      const point = this.buildDataPoint(buf);
      if (isDevelopment) {
        console.log(point);
      }
      this.mainWindow.webContents.send(IPCChannelType.RECEIVE_DATA, point);
    }
  }

  private buildDataPoint(stringBuffer: string): DataPointType {
    return {
      timestamp: new Date(),
      value: stringBuffer,
      valueAsBin: asciiToBin(stringBuffer),
      valueAsDec: asciiToDecimal(stringBuffer),
      valueAsHex: asciiToHex(stringBuffer),
    };
  }

  /**
   * Sends the port list every 5 seconds to the renderer process.
   */
  private async sendPortList() {
    const ports = await this.getPortList();
    this.mainWindow.webContents.send(IPCChannelType.RECEIVE_PORT_LIST, ports);
    setTimeout(this.sendPortList.bind(this), 5000);
  }

  /**
   * Asynchronously retrieves the port list from serialport.
   *
   * @returns port list
   */
  private async getPortList() {
    const portList = await SerialPort.list().then((ports) => {
      if (ports.length === 0) {
        console.log("No ports discovered");
      }
      return ports;
    });
    return portList;
  }

  /**
   * Checks the current connection with the serialport
   *
   * @returns CONNECTED, if a connection is open, else DISCONNECTED
   */
  private checkPortStatus(): ConnectionStatusType {
    if (
      this.serialPortConnection !== undefined &&
      this.serialPortConnection.isOpen
    ) {
      return ConnectionStatusType.CONNECTED;
    }
    return ConnectionStatusType.DISCONNECTED;
  }

  private unescapeSpecialCharacter(str: string) {
    return str
      .replace("\\n", "\n")
      .replace("\\t", "\t")
      .replace("\\r", "\r")
      .replace("\\b", "\b")
      .replace("\\f", "\f")
      .replace("\\'", "'")
      .replace('\\"', '"');
  }
}
