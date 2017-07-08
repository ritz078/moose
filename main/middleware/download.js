const WebTorrent = require('webtorrent');
const { ipcMain } = require('electron');
const mime = require('mime');
const root = require('window-or-global');
const prettyBytes = require('pretty-bytes');
const rimraf = require('rimraf');
const downloadsFolder = require('downloads-folder');
const { readConfig } = require('snape-config');
const decorateTorrentInfo = require('../utils/decorateTorrentInfo');
const { logError, logSuccess } = require('../utils/logEmitter');
const notify = require('../utils/notify');

const client = new WebTorrent();

function onTorrentDone(name) {
  const msg = `Completed downloading ${name}`;
  // eslint-disable-next-line no-unused-expressions
  root.win.isFocused() ? logSuccess(msg) : notify(msg);
}

function addTorrent(infoHash) {
  const torrent = client.add(infoHash, {
    path: downloadsFolder(),
  });
  torrent.on('done', () => onTorrentDone(torrent.name));
}

function init() {
  readConfig((err, { download }) => {
    if (download) {
      download.forEach(d => addTorrent(d.infoHash));
    }
  });
}

ipcMain.on('get_download_data', (event) => {
  const data = {};
  client.torrents.forEach((torrent) => {
    data[torrent.infoHash] = {
      name: torrent.name,
      downloadSpeed: torrent.downloadSpeed,
      progress: torrent.progress * 100,
      uploadSpeed: torrent.uploadSpeed,
      peers: torrent.numPeers,
      infoHash: torrent.infoHash,
      files: torrent.files.map((file, i) => ({
        name: file.name,
        type: mime.lookup(file.name),
        // eslint-disable-next-line no-mixed-operators
        progress: Math.round(file.downloaded / file.length * 100),
        size: prettyBytes(file.length),
        slug: `${torrent.infoHash}/${i}/${file.name}`,
        done: file.done,
        path: `${torrent.path}/${file.path}`,
      })),
    };
  });

  event.sender.send('download_data', data);
});

function getTorrent(infoHash) {
  return client.get(infoHash);
}

ipcMain.on('add_torrent_to_download', (event, infoHash) => addTorrent(infoHash));

ipcMain.on('remove_torrent', (event, infoHash) => client.remove(infoHash));

ipcMain.on('decode_infohash_and_add_to_download', (event, infoHash) => {
  addTorrent(infoHash);

  const torrent = client.get(infoHash);
  torrent.on('metadata', () => {
    const metadata = decorateTorrentInfo(torrent);
    event.sender.send('decoded_infoHash', metadata);
  });
});

ipcMain.on('remove_torrent_files', (event, infoHash) => {
  const torrent = client.get(infoHash);
  client.remove(infoHash);
  if (torrent) {
    rimraf(`${torrent.path}/${torrent.name}`, () => {
      event.sender.send('removed_torrent_files');
    });
  }
});

client.on('error', err => logError(err.message));

client.torrents.forEach((torrent) => {
  torrent.on('done', () => onTorrentDone(torrent.name));
});

module.exports = {
  init,
  getTorrent,
};
