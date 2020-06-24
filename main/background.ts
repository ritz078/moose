import { BrowserWindow, app, dialog } from "electron";
import serve from "electron-serve";
import createWindow from "./helpers/createWindow";
import getPort from "get-port";
import { name } from "../package.json";
import { updateApp } from "./utils/autoUpdate";
// import modules
import { setMenu } from "./modules/menu";
import "./modules/playOnVlc";
import "./modules/progress";

import { createServer, closeServer } from "./server";
import client from "./utils/webtorrent";
import { cleanup } from "./modules/cast";
import { EventEmitter } from "events";
import unhandled from "electron-unhandled";
import "./utils/analytics";
import { is } from "electron-util";

EventEmitter.defaultMaxListeners = 0;

app.commandLine.appendSwitch("enable-experimental-web-platform-features");

app.name = name;
let win: BrowserWindow;
let path: string;
let magnetUri: string;

if (app.isPackaged) {
  unhandled();

  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

async function _createWindow() {
  await app.whenReady();

  try {
    await updateApp();
  } catch (e) {
    console.log(e.message);
  }

  const apiPort = await getPort({
    port: getPort.makeRange(3000, 3010),
  });

  win = createWindow("main", {
    width: 900,
    minWidth: 900,
    minHeight: 640,
    height: 640,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
    vibrancy: "under-window",
    frame: !is.macos,
    titleBarStyle: is.macos ? "hidden" : "default",
  });

  if (is.macos) {
    win.setTrafficLightPosition({
      x: 10,
      y: 30,
    });
  }

  createServer(apiPort, async () => {
    const params = new URLSearchParams();
    params.append("port", apiPort.toString(10));
    if (path) {
      params.append("path", encodeURI(path));
    }
    if (magnetUri) {
      params.append("magnet", encodeURI(magnetUri));
    }
    const query = params.toString();

    if (app.isPackaged) {
      await win.loadURL(`app://./home.html?${query}`);
    } else {
      const port = process.argv[2];
      await win.loadURL(`http://localhost:${port}/home?${query}`);
      win.webContents.openDevTools();
    }
  });

  await setMenu(process.argv[2], win);
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

app.on("open-file", (_e, _path) => {
  if (app.isReady()) {
    win.webContents.send("file-opened", _path);
  } else {
    path = _path;
  }
});

app.setAsDefaultProtocolClient("magnet");
app.on("open-url", (e, url) => {
  if (app.isReady()) {
    win.webContents.send("magnet-opened", url);
  } else {
    magnetUri = url;
  }
});
