import * as WebTorrent from 'webtorrent';

const debug = require('debug')('torrentStore');
const rimraf = require('rimraf');
const parseTorrent = require('parse-torrent');

const BASE_PATH = '/tmp/blizzard/';

export default {
  clients: {},

  getClient(sid) {
    if (this.clients[sid] && !this.clients[sid].destroyed) {
      return this.clients[sid];
    }
    this.clients[sid] = new WebTorrent();
    return this.clients[sid];
  },

  destroyClient(sid) {
    if (this.clients[sid]) {
      this.clients[sid].destroy(() => {
        delete this.clients[sid];
        rimraf(`${BASE_PATH}/${sid}`, () => debug(`all torrents/client for ${sid} deleted`));
      });
    }
  },

  getInfoHashFromTorrentId(torrentId) {
    return parseTorrent(torrentId).infoHash;
  },

  removeTorrents(sid, infoHash, cb) {
    const client = this.clients[sid];
    client.torrents.forEach((torrent) => {
      if (torrent.infoHash !== infoHash) {
        rimraf(`${BASE_PATH}/${sid}/${torrent.name}`, () => {
          debug(`removed all torrents except ${infoHash}`);
          if (cb) {
            cb();
          }
        });
      }
    });
  },

  getTorrent(sid, torrentId) {
    const client = this.getClient(sid);

    // destroy all torrents except infoHash
    const infoHash = parseTorrent(torrentId).infoHash;
    this.removeTorrents(sid, infoHash);

    return client.get(torrentId) || client.add(torrentId, {
      path: `${BASE_PATH}/${sid}`,
    });
  },
};
