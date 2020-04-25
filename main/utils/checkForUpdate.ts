import axios from "axios";
import semver from "semver";
import { version } from "../../package.json";
import { dialog, shell, app } from "electron";

export async function checkForUpdate() {
  try {
    const { data } = await axios.get(
      "https://api.github.com/repos/ritz078/snape/releases/latest"
    );

    const { html_url, name } = data;

    if (semver.gt(name, version)) {
      const { response } = await dialog.showMessageBox({
        title: "Update Available",
        buttons: ["Download now", "Remind me later"],
        message: `A new version of Snape is available. Please update to the latest release.`,
      });

      if (response === 0) {
        await shell.openExternal(html_url);
        app.quit();
      }
    }
  } catch (e) {}
}
