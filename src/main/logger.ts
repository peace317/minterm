import { ipcMain } from 'electron';
import log from 'electron-log';
import { LogMessage } from '../services/Logger';
import { IPCChannelType } from '../renderer/types/enums/IPCChannelType';
import { format } from 'util';

export default class ElectronLogger {

  init(): void {
    ipcMain.on(IPCChannelType.DEBUG, (event, args) => {
      log.debug(this.buildLogString(args));
    });

    ipcMain.on(IPCChannelType.INFO, async (event, args) => {
      log.info(this.buildLogString(args));
    });

    ipcMain.on(IPCChannelType.LOG, async (event, args) => {
      log.log(this.buildLogString(args));
    });

    ipcMain.on(IPCChannelType.WARN, async (event, args) => {
      log.warn(this.buildLogString(args));
    });

    ipcMain.on(IPCChannelType.ERROR, async (event, args) => {
      log.error(this.buildLogString(args));
    });
  }

  public buildLogString(data: unknown[]): string {
    let res = '';
    const msgData = data[0] as LogMessage;
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