import { IPCChannelType } from '../renderer/types/IPCChannelType';
import { ipcMain } from 'electron';
import log from 'electron-log';
import { LogMessage } from 'renderer/services/Logger';
import { format } from 'util';

export default class ElectronLogger {
  constructor() {}

  init(): void {
    ipcMain.on(IPCChannelType.DEBUG, (event, arg) => {
      log.debug(this.buildLogString(arg));
    });

    ipcMain.on(IPCChannelType.INFO, async (event, arg) => {
      log.info(this.buildLogString(arg));
    });

    ipcMain.on(IPCChannelType.LOG, async (event, arg) => {
      log.log(this.buildLogString(arg));
    });

    ipcMain.on(IPCChannelType.WARN, async (event, arg) => {
      log.warn(this.buildLogString(arg));
    });

    ipcMain.on(IPCChannelType.ERROR, async (event, arg) => {
      log.error(this.buildLogString(arg));
    });
  }

  public buildLogString(data: any): any {
    var res = '';
    var msgData = data[0] as LogMessage;
    if (msgData !== undefined) {
      if (msgData.classSource !== undefined && msgData.classSource.length > 0) {
        res = '[' + msgData.classSource + '] - ';
      }
      if (msgData.message !== undefined) {
        res += format(msgData.message, ...msgData.optionalParams);
      }
    } else {
      res += data;
    }
    return res;
  }
}
