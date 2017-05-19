const WebTorrent = require('webtorrent');
const { ipcMain, app } = require('electron');
const mime = require('mime');
const prettyBytes = require('pretty-bytes');
const downloadsFolder = require('downloads-folder');
const decorateTorrentInfo = require('../utils/decorateTorrentInfo');
const { readConfig } = require('../../renderer/utils/config');

const client = new WebTorrent();

function addTorrent(infoHash) {
  client.add(infoHash, {
    path: downloadsFolder()
  });
}

function init() {
  readConfig((err, { download }) => {
    if (download) {
      download.forEach(d => addTorrent(d.infoHash));
    }
  });
}

let interval;

ipcMain.on('init_download_polling', (event) => {
  interval = setInterval(() => {
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
          progress: Math.round(file.downloaded / file.length * 100),
          size: prettyBytes(file.length),
          slug: `${torrent.infoHash}/${i}/${file.name}`
        }))
      };
    });

    event.sender.send('download_data', data);
  }, 1000);
});

function getTorrent(infoHash) {
  return client.get(infoHash);
}

ipcMain.on('end_download_polling', () => {
  clearInterval(interval);
});

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

app.on('close', () => {
  clearInterval(interval);
});

module.exports = {
  init,
  getTorrent
};
