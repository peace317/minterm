import { IPCChannelType } from "./types/IPCChannelType";
import { StoreKey } from "./types/StoreKeyType";

/**
 * Declared context bridge functions.
 */
declare global {
  interface Window {
    electron: {
      /**
       * Provides functions for asynchronous communication between renderer and
       * main process.
       */
      ipcRenderer: {
        /**
         * Sends a message as an argument vector to the main process.
         * This is only one-directional, although the listener of the main
         * process could send a new message.
         *
         * @param channel channel with declared listener in main
         * @param args arguments
         */
        sendMessage(channel: IPCChannelType, ...args: unknown[]): void;
        /**
         * Declares a listener on the channel. The function parameter will be
         * executed if the listener receives a message.
         *
         * INFO:
         * The state of variables of the function parameter will be constant for
         * the listener. Accessing states should only be used in rare cases. In
         * addition to that, it's a bad idea to add a new listener on state changes,
         * either wanted or a state is used in the function parameter. This will result
         * in memory leaks. So the old listener must either be removed (@see {@link once}) or
         * be created only ones.
         *
         * @param channel channel for caller in main
         * @param func function parameter executed on receiving message
         */
        on(
          channel: IPCChannelType,
          func: (...args: unknown[]) => void
        ): Electron.IpcRenderer;
        /**
         * Declares a listener on the channel. The function parameter will be
         * called once on receiving a message. After that the listener will
         * be removed.
         *
         * @param channel channel for caller in main
         * @param func function parameter executed once on receiving message
         */
        once(channel: IPCChannelType, func: (...args: unknown[]) => void): void;
        /**
         * For bidirectional communication between renderer and main this function
         * sends a message to the main process and returns a message synchronous.
         * This also implies, that every fetch request have to be in realtime, thus
         * blocking the app, until the request is answered.
         *
         * @param channel channel for listener in main
         * @param args arguments
         * @returns reply from main
         */
        fetch: (channel: IPCChannelType, ...args: unknown[]) => any;
        /**
         * Removes a specific listener of the associated channel.
         *
         * @param channel channel
         * @param listener listener
         */
        removeListener(channel: IPCChannelType, listener: (...args: any[]) => void): unknown;
        /**
         * Removes all listeners of the associated channel.
         *
         * @param channel channel with listeners
         */
        removeAllListener(channel: IPCChannelType): unknown;
      };
      /**
       * IPC-Communication with electron-store for storing states.
       */
      store: {
        /**
         * Gets a value from the store. Results undefined, if a key
         * is not available.
         *
         * @param key store-key
         * @returns value or undefined
         */
        get: (key: StoreKey) => any;
        /**
         * Stores a value. An known key will override the old value.
         *
         * @param key store-key
         * @param val new value
         */
        set: (key: StoreKey, val: any) => void;
      };
      /**
       * Logging functions for persist logs with electron-log.
       */
      logger: {
        log: (...params: any[]) => void;
        info: (...params: any[]) => void;
        debug: (...params: any[]) => void;
        error: (...params: any[]) => void;
        warn: (...params: any[]) => void;
      };
    };
  }
}

export {};
