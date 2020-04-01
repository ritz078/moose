import { BrowserWindow, app } from "electron";
import serve from "electron-serve";
import createWindow from "./helpers/createWindow";
import path from "path";
import os from "os";
import getPort from "get-port";

// import modules
import "./modules/description";
import { cleanup } from "./modules/details";
import "./modules/playOnVlc";
import { createServer, closeServer } from "./server";

const isProd: boolean = process.env.NODE_ENV === "production";

app.name = "Snape";

let win: BrowserWindow;

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

async function _createWindow() {
  await app.whenReady();

  const apiPort = await getPort({
    port: getPort.makeRange(3000, 3010),
  });

  win = createWindow("main", {
    width: 800,
    minWidth: 500,
    webPreferences: {
      nodeIntegration: true,
    },
    vibrancy: "ultra-dark",
  });

  // BrowserWindow.addDevToolsExtension(
  //   path.join(
  //     os.homedir(),
  //     "/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.5.0_0"
  //   )
  // );

  if (isProd) {
    await win.loadURL(`app://./home.html`);
  } else {
    const port = process.argv[2];
    await win.loadURL(`http://localhost:${port}/home?port=${apiPort}`);
    win.webContents.openDevTools();
  }

  createServer(apiPort);
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

app.on("ready", _createWindow);

app.on("will-quit", () => {
  cleanup();
  closeServer();
});

app.on("window-all-closed", () => {
  app.quit();
});
