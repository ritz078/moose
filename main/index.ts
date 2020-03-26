import Electron from "electron";
import BrowserWindow = Electron.BrowserWindow;
import app = Electron.app;

require("electron-debug")();

app.name = "Snape";

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    frame: false,
    titleBarStyle: "hidden",
    minWidth: 500,
    webPreferences: {
      nodeIntegration: true,
    },
    vibrancy: "ultra-dark"
  });

  win.setTrafficLightPosition({
    x: 20,
    y: 33,
  });

  // BrowserWindow.addDevToolsExtension(
  //   path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.5.0_0')
  // )

  win.loadURL("http://localhost:3000");
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  // Create myWindow, load the rest of the app, etc...
  app.whenReady().then(() => {});
}

app.allowRendererProcessReuse = true;

app.on("ready", createWindow);
