import '@testing-library/jest-dom';
import { SerialPortService, asciiToBin, asciiToDecimal, asciiToHex } from '@minterm/services';
import { ConversionType, IPCChannelType } from '@minterm/types';
import { ipcRenderer, ipcMain } from 'electron';

// init global window.electron.ipcRenderer
global.window = Object.assign(global.window || {}, {
  electron: {
    ipcRenderer: ipcRenderer,
  },
});

// init ipcRenderer and ipcMain, ipcRenderer calls will be delegated to ipcMain to use as listeners
jest.mock(
  'electron',
  () => {
    const listeners = new Map();

    const mElectron = {
      ipcRenderer: {
        on: jest.fn(),
        send: jest.fn(),
        sendMessage: (channel: IPCChannelType, ...args: unknown[]) => {
          const listener = listeners.get(channel);
          if (listener) {
            listener(undefined, ...args);
          }
        },
      },
      ipcMain: {
        on: (channel: string, listener: (event: Electron.IpcMainEvent, ...args: any[]) => void) => {
          listeners.set(channel, listener);
        }
      }
    };
    return mElectron;
  },
  { virtual: true }
);

/* ----------------------- Test Ascii ------------------------- */
/* ------------------------------------------------------------ */
test('test send data as Ascii', async () => {
  ipcMain.on(IPCChannelType.SEND_DATA, (event: any, arg: any) => {
    expect(arg).toEqual('Test1 \n');
  });
  SerialPortService.sendMessage('Test1 \n', ConversionType.ASCII);
});

test('test send data as Ascii - convert to binary', async () => {
  ipcMain.on(IPCChannelType.SEND_DATA, (event: any, arg: any) => {
    expect(asciiToBin(arg)).toEqual('1010100,1100101,1110011,1110100,110001,100000,1010');
  });
  SerialPortService.sendMessage('Test1 \n', ConversionType.ASCII);
});

test('test send data as Ascii - convert to hex', async () => {
  ipcMain.on(IPCChannelType.SEND_DATA, (event: any, arg: any) => {
    expect(asciiToHex(arg)).toEqual('54,65,73,74,31,20,A');
  });
  SerialPortService.sendMessage('Test1 \n', ConversionType.ASCII);
});

test('test send data as Ascii - convert to decimal', async () => {
  ipcMain.on(IPCChannelType.SEND_DATA, (event: any, arg: any) => {
    expect(asciiToDecimal(arg)).toEqual('84,101,115,116,49,32,10');
  });
  SerialPortService.sendMessage('Test1 \n', ConversionType.ASCII);
});
/* --------------------- Test Decimal ------------------------- */
/* ------------------------------------------------------------ */
test('test send data as decimal', async () => {
  ipcMain.on(IPCChannelType.SEND_DATA, (event: any, arg: any) => {
    expect(asciiToDecimal(arg)).toEqual('213');
  });
  SerialPortService.sendMessage('213', ConversionType.DEC);
});

/* ---------------------- Test Binary ------------------------- */
/* ------------------------------------------------------------ */
test('test send data as binary', async () => {
  ipcMain.on(IPCChannelType.SEND_DATA, (event: any, arg: any) => {
    expect(asciiToBin(arg)).toEqual('11001100');
  });
  SerialPortService.sendMessage('11001100', ConversionType.BIN);
});

/* ------------------------- Test Hex ------------------------- */
/* ------------------------------------------------------------ */
test('test send data as hex', async () => {
  ipcMain.on(IPCChannelType.SEND_DATA, (event: any, arg: any) => {
    expect(asciiToHex(arg)).toEqual('A2,EE');
  });
  SerialPortService.sendMessage('A2EE', ConversionType.HEX);
});