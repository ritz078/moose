import { BrowserWindow, app } from "electron";
import serve from "electron-serve";
import createWindow from "./helpers/createWindow";
import getPort from "get-port";
import { name } from "../package.json";

// import modules
import "./modules/playOnVlc";
import "./modules/progress";
import "./modules/dlnacasts";

import { createServer, closeServer } from "./server";
import client from "./utils/webtorrent";
import { cleanup } from "./modules/cast";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 0;

app.commandLine.appendSwitch("enable-experimental-web-platform-features");

const isProd: boolean = process.env.NODE_ENV === "production";

app.name = name;

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
    width: 900,
    minWidth: 900,
    minHeight: 640,
    webPreferences: {
      nodeIntegration: true,
    },
    vibrancy: "under-window",
    frame: false,
    titleBarStyle: "hidden",
  });

  win.setTrafficLightPosition({
    x: 10,
    y: 30,
  });

  createServer(apiPort, async () => {
    if (isProd) {
      await win.loadURL(`app://./home.html?port=${apiPort}`);
    } else {
      const port = process.argv[2];
      await win.loadURL(`http://localhost:${port}/home?port=${apiPort}`);
      win.webContents.openDevTools();
    }
  });
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
  closeServer();
  client.destroy();
  cleanup();
});

app.on("window-all-closed", () => {
  app.quit();
});
