import { Menu, BrowserWindow, ipcMain, app } from "electron";
import { appMenu, is } from "electron-util";

export async function setMenu(port, mainWin: BrowserWindow) {
  const menu = Menu.buildFromTemplate([
    appMenu([
      {
        label: "Preferences…",
        accelerator: "Command+,",
        click: async function () {
          const settingsWindow = new BrowserWindow({
            width: 500,
            height: 400,
            title: "Preferences",
            webPreferences: {
              nodeIntegration: true,
            },
            vibrancy: "under-window",
            frame: false,
            titleBarStyle: "hiddenInset",
          });

          if (!is.development) {
            await settingsWindow.loadURL(`app://./settings.html`);
          } else {
            await settingsWindow.loadURL(`http://localhost:${port}/settings`);
            settingsWindow.webContents.openDevTools();
          }

          ipcMain.on("preferences-changed-source", (e, color) => {
            mainWin.webContents.send("preferences-changed", {
              color,
            });
          });
        },
      },
    ]),
  ]);

  Menu.setApplicationMenu(menu);
}
