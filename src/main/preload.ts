import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { StoreKey } from 'renderer/types';

const validChannels = {
      // From render to main.
      'send': [
          'connect:port',
          'disconnect:port',
          'kill:app',
          'reload:app'
      ],
      // From main to render.
      'receive': [
          'port:status',
          'asynchronous-message',
          'port:connection:data',
          'reload:app:reply'
      ],
      // From render to main and back again.
      'sendReceive': [
          'dialog:portList'
      ]
  };

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: string, ...args: unknown[]) {
      if (validChannels.send.includes(channel)) {
        ipcRenderer.send(channel, args);
      } else {
        console.error("Undefined channel: " + channel);
      }
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      if (validChannels.receive.includes(channel) && !ipcRenderer.listeners('myEvent').length) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.addListener(channel, subscription);
        return () => ipcRenderer.removeListener(channel, subscription);
      }
      console.error("Undefined channel: " + channel);
      return undefined;
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      if (validChannels.receive.includes(channel)) {
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      } else {
        console.error("Undefined channel: " + channel);
      }
    },
    removeAllListener(channel: string) {
      return () => ipcRenderer.removeAllListeners(channel);
    },
  },
  store: {
    get(key: StoreKey) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(key: StoreKey, val: any) {
      ipcRenderer.send('electron-store-set', key, val);
    },
  }
});
