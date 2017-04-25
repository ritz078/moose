const vlc = require('vlc-command');
const { spawn } = require('child_process');

let proc;

function playOnVlc(url, fileName) {
  vlc((err, path) => {
    const args = [
      '--play-and-exit',
      '--video-on-top',
      '--quiet',
      `--meta-title=${JSON.stringify(fileName)}`,
      url
    ];

    proc = spawn(path, args);
  });
}

// end the vlc process
function kill() {
  if (!proc) return;
  proc.kill('SIGKILL');
  proc = null;
}

module.exports = {
  playOnVlc,
  kill
};
