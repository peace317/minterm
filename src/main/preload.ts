import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Logger } from 'renderer/services/Logger';
import { IPCChannelType } from 'renderer/types/IPCChannelType';
import { StoreKey } from 'renderer/types/StoreKeyType';

const className = 'preload';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: IPCChannelType, ...args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: IPCChannelType, func: (...args: unknown[]) => void) {
      ipcRenderer.send(IPCChannelType.INFO, [
        Logger.buildMessageTemplate(
          className,
          'Registering new IPC-listener ' +
            channel +
            ': ' +
            ipcRenderer.listenerCount(channel)
        ),
      ]);
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: IPCChannelType, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    fetch(channel: IPCChannelType, ...args: unknown[]) {
      return ipcRenderer.sendSync(channel, ...args);
    },
    removeListener(
      channel: IPCChannelType,
      listener: (...args: any[]) => void
    ) {
      var cnt = ipcRenderer.listenerCount(channel);
      ipcRenderer.removeListener(channel, listener);
      if (cnt === ipcRenderer.listenerCount(channel)) {
        console.warn('Listener was not removed! Channel: ' + channel);
      }
    },
    removeAllListener(channel: IPCChannelType) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
  store: {
    get(key: StoreKey) {
      return ipcRenderer.sendSync(IPCChannelType.STORE_GET, key);
    },
    set(key: StoreKey, val: any) {
      ipcRenderer.send(IPCChannelType.STORE_SET, key, val);
    },
  },
  logger: {
    log(...params: any[]) {
      ipcRenderer.send(IPCChannelType.LOG, params);
    },
    info(...params: any[]) {
      ipcRenderer.send(IPCChannelType.INFO, params);
    },
    debug(...params: any[]) {
      ipcRenderer.send(IPCChannelType.DEBUG, params);
    },
    error(...params: any[]) {
      ipcRenderer.send(IPCChannelType.ERROR, params);
    },
    warn(...params: any[]) {
      ipcRenderer.send(IPCChannelType.WARN, params);
    },
  },
});
