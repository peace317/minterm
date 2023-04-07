import { ConversionType } from '../types/ConversionType';
import { IPCChannelType } from '../types/IPCChannelType';
import { FormatService } from './FormatService';

export class SerialPortService {

  /**
   * Converts the sequence to a transmittable message, that is then send to the main
   * process for transfering to the serialport.
   *
   * The given type must coincide with type of the sequence, as this is used for
   * correctly formatting the sequence. An ASCII sequence does not conform
   * with the conversion type BIN for example.
   *
   * @param sequence sequence to be send
   * @param type type of the sequence
   */
  static sendMessage = (sequence: string, type: ConversionType): void => {
    var transmit = '';
    switch (type) {
      case ConversionType.ASCII:
        transmit = sequence;
        break;
      case ConversionType.BIN:
        transmit = FormatService.binArrayToAscii(
          FormatService.binToBinArray(sequence)
        );
        break;
      case ConversionType.DEC:
        transmit = FormatService.decimalToAscii(Number(sequence));
        break;
      case ConversionType.HEX:
        transmit = FormatService.hexToAscii(sequence);
        break;
      default:
        console.error("Unnknown conversion type: " + type);
    }
    window.electron.ipcRenderer.sendMessage(IPCChannelType.SEND_DATA, transmit);
  };
}
