import WebTorrent from 'webtorrent';
import tempy from 'tempy';

const debug = require('debug')('torrentStore');
const rimraf = require('rimraf');
const parseTorrent = require('parse-torrent');

const BASE_PATH = tempy.directory();

export default {
  client: null,

  getClient() {
    if (this.client && !this.client.destroyed) {
      return this.client;
    }
    this.client = new WebTorrent();
    return this.client;
  },

  destroyClient() {
    if (this.client) {
      this.client.destroy(() => {
        delete this.client;
        rimraf(`${BASE_PATH}`, () => debug(`all torrents/client deleted`));
      });
    }
  },

  removeTorrents(infoHash, cb) {
    const client = this.client;
    client.torrents.forEach((torrent) => {
      if (torrent.infoHash !== infoHash) {
        rimraf(`${BASE_PATH}/${torrent.name}`, () => {
          debug(`removed all torrents except ${infoHash}`);
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

    return client.get(torrentId) || client.add(torrentId, {
      path: `${BASE_PATH}`,
    });
  },
};
