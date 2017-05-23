const WebTorrent = require('webtorrent');
const tempy = require('tempy');

const rimraf = require('rimraf');
const parseTorrent = require('parse-torrent');

const BASE_PATH = tempy.directory();

module.exports = {
  client: null,

  getClient() {
    if (this.client && !this.client.destroyed) {
      return this.client;
    }
    this.client = new WebTorrent();
    return this.client;
  },

  removeTorrents(infoHash, cb) {
    const client = this.client;
    client.torrents.forEach((torrent) => {
      if (torrent.infoHash !== infoHash) {
        rimraf(`${BASE_PATH}/${torrent.name}`, () => {
          if (cb) {
            cb();
          }
        });
      }
    });
  },

  getTorrent(torrentId) {
    const client = this.getClient();

    // destroy all torrents except infoHash
    const infoHash = parseTorrent(torrentId).infoHash;
    this.removeTorrents(infoHash);

    return (
      client.get(torrentId) ||
      client.add(torrentId, {
        path: `${BASE_PATH}`
      })
    );
  }
};
