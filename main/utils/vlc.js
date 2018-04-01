const vlc = require('vlc-command');
const { app } = require('electron');
const { spawn } = require('child_process');

let proc;

function playOnVlc(url, fileName) {
  vlc((err, path) => {
    const args = ['--quiet', `--meta-title=${JSON.stringify(fileName)}`, url];

    proc = spawn(path, args);
  });
}

function isVlcPresent(cb) {
  vlc((err, path) => {
    cb(!err && path);
  });
}

// end the vlc process
function kill() {
  if (!proc) return;
  proc.kill('SIGKILL');
  proc = null;
}

app.on('close', kill);

module.exports = {
  playOnVlc,
  kill,
  isVlcPresent,
};
