import { StoreKey } from "./types";

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: string, ...args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
          ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        removeAllListener(channel: string): unknown;
      };
      store: {
        get: (key: StoreKey) => any;
        set: (key: StoreKey, val: any) => void;
      };
    };
  }
}

export {};
