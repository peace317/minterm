/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import defaults from './defaultSettings';
import { resolveHtmlPath } from './util';
import Store from 'electron-store';
import { IPCChannelType } from '../renderer/types/IPCChannelType';
import SerialPortListener from './serialportListener';
import ElectronLogger from './logger';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = isDevelopment ? 'debug' : 'info';
    log.transports.file.fileName = app.getName() + '.log';
    log.transports.remote.level = 'debug';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const store = new Store({
  defaults,
  clearInvalidConfig: true,
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  // accessing application debugging (https://www.electronjs.org/docs/latest/tutorial/application-debugging)
  require('electron-debug')();
}

// overriding console log functions
Object.assign(console, log.functions);

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {

  if (isDevelopment) {
    await installExtensions();
  }

  const logger = new ElectronLogger();
  logger.init();
  console.info("versions: " + JSON.stringify(process.versions));
  console.info("userData: " + app.getPath('userData'));
  console.info("logs: " + app.getPath('logs'));

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: true,
    },
  });

  const serialPortConnector = new SerialPortListener(mainWindow, store);
  serialPortConnector.init();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }

  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send(IPCChannelType.APP_MAXIMIZE);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send(IPCChannelType.APP_UNMAXIMIZE);
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('render-process-gone', (event, webContents, details) => {
  // Emitted when the renderer process unexpectedly disappears.
  // This is normally because it was crashed or killed.
  log.error(details.reason);
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on(IPCChannelType.APP_CLOSE, async (event, arg) => {
  mainWindow?.close();
});

ipcMain.on(IPCChannelType.APP_RELOAD, async (event, arg) => {
  mainWindow?.reload();
});

ipcMain.on(IPCChannelType.APP_MINIMIZE, async (event, arg) => {
  mainWindow?.minimize();
});

ipcMain.on(IPCChannelType.APP_MAXIMIZE, async (event, arg) => {
  mainWindow?.maximize();
});

ipcMain.on(IPCChannelType.APP_RESTORE, async (event, arg) => {
  mainWindow?.restore();
});

ipcMain.on(IPCChannelType.APP_VERSIONS, async (event, arg) => {
  event.returnValue = process.versions;
});

ipcMain.on(IPCChannelType.STORE_GET, async (event, val) => {
  event.returnValue = store.get(val);
});

ipcMain.on(IPCChannelType.STORE_SET, async (event, key, val) => {
  if (val === null || val === undefined) {
    store.delete(key);
  } else {
    store.set(key, val);
  }
});

ipcMain.on(IPCChannelType.LOG_FILE, async (event, arg) => {
  event.returnValue = log.transports.file.readAllLogs();
});

ipcMain.on(IPCChannelType.OPEN_FILE, async (event, arg) => {
  shell.openPath(arg[0]);
});

ipcMain.on(IPCChannelType.IS_DEVELOPMENT, async (event, arg) => {
  event.returnValue = isDevelopment;
});

ipcMain.on(IPCChannelType.GET_ENV, async (event, arg) => {
  event.returnValue = process.env[arg];
});
