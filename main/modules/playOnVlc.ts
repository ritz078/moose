import { ipcMain } from "electron";
import vlcCommand from "vlc-command";
import { spawn } from "child_process";
import { app, dialog } from "electron";

let proc;
ipcMain.handle("playOnVlc", async (e, url, caption) => {
  kill();
  vlcCommand(function (err, path) {
    if (err) {
      dialog.showErrorBox("VLC Error", err.message);
      return;
    }

    const args = [
      "--quiet",
      `--meta-title=${JSON.stringify(
        url.split("/")[url.split("/").length - 1]
      )}`,
      ...(caption ? [`--sub-file=${caption}`] : []),
      url,
    ];

    proc = spawn(path, args);
  });
});

function kill() {
  if (!proc) return;
  proc.kill("SIGKILL");
  proc = null;
}

app.on("quit", kill);
