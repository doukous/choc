import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
} from "electron";
import path from "path";

let mainWindow: BrowserWindow | null = null;

function setFocusOnWindow() {
  // if (isShrinked) extendWindow();
  if (mainWindow && !mainWindow.isFocused()) mainWindow.show();
}

function shrinkWindow() {
  if (mainWindow) {
    mainWindow.setSize(310, 58);
    mainWindow.setResizable(false);
    mainWindow.setAlwaysOnTop(true);
  }
}

function extendWindow() {
  if (mainWindow) {
    mainWindow.setResizable(true);
    mainWindow.setSize(600, 600);
    mainWindow.setAlwaysOnTop(false);
  }
}

function toggleSize() {
  if (mainWindow) {
    if (!mainWindow.isMaximized()) mainWindow.maximize();
    else mainWindow.unmaximize();
  }
}

function createWindow() {
  const windowConfig: BrowserWindowConstructorOptions = {
    width: 600,
    height: 600,
    frame: false,
    transparent: true,

    webPreferences: {
      preload: path.join(
        app.getAppPath(),
        "/dist/backend-electron/preload.cjs"
      ),
      backgroundThrottling: false,
    },
  };

  if (app.isPackaged) {
    windowConfig.autoHideMenuBar = true;
  }

  mainWindow = new BrowserWindow(windowConfig);

  if (!app.isPackaged) mainWindow.loadURL("http://localhost:5123");
  else
    mainWindow.loadFile(
      path.join(app.getAppPath(), "dist/frontend/index.html")
    );

  if (!app.isPackaged) mainWindow.setPosition(1200, 200);
}

app.on("ready", () => {
  ipcMain.on("set-focus", setFocusOnWindow);
  ipcMain.on("toggle-size", toggleSize);
  ipcMain.on("minimize", () => {
    if (mainWindow) mainWindow.minimize();
  });
  ipcMain.on("close", () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.on("shrink", shrinkWindow);
  ipcMain.on("extend", extendWindow);
  createWindow();
});
