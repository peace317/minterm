import { IPCChannelType, ConversionType } from '@minterm/types';
import { binArrayToAscii, binToBinArray, decimalToAscii, hexToAscii } from './FormatService';
import log from 'electron-log/renderer';

export class SerialPortService {
  /**
   * Converts the sequence to a transmittable message, that is then send to the main
   * process for transferring to the serialport.
   *
   * The given type must coincide with type of the sequence, as this is used for
   * correctly formatting the sequence. An ASCII sequence does not conform
   * with the conversion type BIN for example.
   *
   * @param sequence sequence to be send
   * @param type type of the sequence
   */
  static sendMessage = (sequence: string, type: ConversionType): void => {
    let transmit = '';
    log.log(sequence);
    switch (type) {
      case ConversionType.ASCII:
        transmit = sequence;
        break;
      case ConversionType.BIN:
        transmit = binArrayToAscii(
          binToBinArray(sequence)
        );
        break;
      case ConversionType.DEC:
        transmit = decimalToAscii(Number(sequence));
        break;
      case ConversionType.HEX:
        transmit = hexToAscii(sequence);
        break;
      default:
        console.error(`Unknown conversion type: ${type}`);
    }
    window.electron.ipcRenderer.sendMessage(IPCChannelType.SEND_DATA, transmit);
  };
}

export default SerialPortService;
