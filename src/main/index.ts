import { IPCChannelType, StoreKey } from "@minterm/types";
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from "electron";
import { autoUpdater } from "electron-updater";
import Store from "electron-store";
import defaults from "./defaultSettings";
import log from "electron-log";
import MenuBuilder from "./menu";
import SerialPortListener from "@/main/serialportListener";

// Before doing anything, make sure logger is assigned to track everything in the ongoing initialization
Object.assign(console, log.functions);
log.initialize({ spyRendererConsole: true });

import "dotenv/config";
import "@/lib/env";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
export const isDevelopment =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
const store = new Store({
  defaults,
  clearInvalidConfig: true,
});

class AppUpdater {
  constructor() {
    log.transports.file.level = isDevelopment ? "debug" : "info";
    log.transports.file.fileName = `${app.getName()}.log`;
    log.transports.remote.level = "debug";
    log.transports.console.format =
      "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

Object.assign(console, log.functions);
log.initialize({ spyRendererConsole: true });

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 728,
    width: 1024,
    webPreferences: {
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  const serialPortConnector = new SerialPortListener(mainWindow, store);
  serialPortConnector.init();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  // Open the DevTools.
  if (isDevelopment) mainWindow.webContents.openDevTools();

  nativeTheme.themeSource = store.get(StoreKey.THEME) as unknown as
    | "system"
    | "light"
    | "dark";

  new AppUpdater();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
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

ipcMain.on(IPCChannelType.LOG_FILE, async (event) => {
  event.returnValue = log.transports.file.readAllLogs();
});

ipcMain.on(IPCChannelType.OPEN_FILE, async (event, args) => {
  shell.openPath(args[0]);
});

ipcMain.on(IPCChannelType.IS_DEVELOPMENT, async (event) => {
  event.returnValue = isDevelopment;
});

ipcMain.on(IPCChannelType.CHANGE_THEME, async (event, args) => {
  nativeTheme.themeSource = args[0];
});
