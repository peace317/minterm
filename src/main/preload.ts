/* eslint-disable no-unused-vars */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPCChannelType } from '../renderer/types/enums/IPCChannelType';
import { StoreKey } from '../renderer/types/enums/StoreKeyType';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: IPCChannelType, ...args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: IPCChannelType, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: IPCChannelType, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    fetch(channel: IPCChannelType, ...args: unknown[]) {
      return ipcRenderer.sendSync(channel, ...args);
    },
    removeListener(
      channel: IPCChannelType,
      listener: (...args: unknown[]) => void
    ) {
      const cnt = ipcRenderer.listenerCount(channel);
      ipcRenderer.removeListener(channel, listener);
      if (cnt === ipcRenderer.listenerCount(channel)) {
        console.warn(`Listener was not removed! Channel: ${channel}`);
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
    set(key: StoreKey, val: unknown) {
      ipcRenderer.send(IPCChannelType.STORE_SET, key, val);
    },
  },
  logger: {
    log(...params: unknown[]) {
      ipcRenderer.send(IPCChannelType.LOG, params);
    },
    info(...params: unknown[]) {
      ipcRenderer.send(IPCChannelType.INFO, params);
    },
    debug(...params: unknown[]) {
      ipcRenderer.send(IPCChannelType.DEBUG, params);
    },
    error(...params: unknown[]) {
      ipcRenderer.send(IPCChannelType.ERROR, params);
    },
    warn(...params: unknown[]) {
      ipcRenderer.send(IPCChannelType.WARN, params);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
