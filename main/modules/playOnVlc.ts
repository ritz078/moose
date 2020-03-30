import { ipcMain } from "electron";
import vlcCommand from "vlc-command";
import { spawn } from "child_process";
import { app } from "electron";

let proc;
ipcMain.handle("playOnVlc", async (e, url) => {
  kill();
  vlcCommand(function (err, path) {
    const args = [
      "--quiet",
      `--meta-title=${JSON.stringify(
        url.split("/")[url.split("/").length - 1]
      )}`,
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
