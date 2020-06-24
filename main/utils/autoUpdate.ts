import { autoUpdater } from "electron-updater";
import { dialog, app } from "electron";
import { name } from "../../package.json";
import { logger } from "./logger";

autoUpdater.logger = logger;

export async function updateApp() {
  autoUpdater.on("update-downloaded", async ({ version }) => {
    const { response } = await dialog.showMessageBox({
      message: "App update available",
      detail: `Updated v${version} of ${name} downloaded. Restart to install it.`,
      buttons: ["Restart", "Remind me later"],
      defaultId: 0,
    });

    if (response === 0) {
      setImmediate(() => autoUpdater.quitAndInstall());
    }
  });

  autoUpdater.on("error", async (err) => {
    if (!err.message.includes("HttpError: 404 Not Found")) {
      await dialog.showMessageBox({
        type: "error",
        message: err.message,
      });
    }
  });

  await autoUpdater.checkForUpdates();
}

export function cleanupAutoUpdate() {
  autoUpdater.removeAllListeners("update-downloaded");
  autoUpdater.removeAllListeners("error");
}

app.on("will-quit", cleanupAutoUpdate);
