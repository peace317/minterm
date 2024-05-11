/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { BrowserWindow, app, ipcMain, shell, nativeTheme } from 'electron';
import log from 'electron-log';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { IPCChannelType } from '../renderer/types/enums/IPCChannelType';
import defaults from './defaultSettings';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { StoreKey } from '../renderer/types/enums/StoreKeyType';

let mainWindow: BrowserWindow | null = null;

const store = new Store({
  defaults,
  clearInvalidConfig: true,
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export default isDevelopment;

class AppUpdater {
  constructor() {
    log.transports.file.level = isDevelopment ? 'debug' : 'info';
    log.transports.file.fileName = `${app.getName()}.log`;
    log.transports.remote.level = 'debug';
    log.transports.console.format =
      '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

Object.assign(console, log.functions);
log.initialize({ spyRendererConsole: true });

if (isDevelopment) {
  require('electron-debug')();
}

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

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

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

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  nativeTheme.themeSource = store.get(StoreKey.THEME) as unknown as ('system' | 'light' | 'dark');

  // Remove this if your app does not use auto updates
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

ipcMain.on(IPCChannelType.APP_CLOSE, async () => {
  mainWindow?.close();
});

ipcMain.on(IPCChannelType.APP_RELOAD, async () => {
  mainWindow?.reload();
});

ipcMain.on(IPCChannelType.APP_MINIMIZE, async () => {
  mainWindow?.minimize();
});

ipcMain.on(IPCChannelType.APP_MAXIMIZE, async () => {
  mainWindow?.maximize();
});

ipcMain.on(IPCChannelType.APP_RESTORE, async () => {
  mainWindow?.restore();
});

ipcMain.on(IPCChannelType.APP_VERSIONS, async (event) => {
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

ipcMain.on(IPCChannelType.OPEN_FILE, async (event, args) => {
  shell.openPath(args[0]);
});

ipcMain.on(IPCChannelType.IS_DEVELOPMENT, async (event, arg) => {
  event.returnValue = isDevelopment;
});

ipcMain.on(IPCChannelType.GET_ENV, async (event, arg) => {
  event.returnValue = process.env[arg];
});

ipcMain.on(IPCChannelType.CHANGE_THEME, async (event, args) => {
  nativeTheme.themeSource = args[0];
});