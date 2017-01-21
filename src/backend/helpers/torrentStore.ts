import * as WebTorrent from 'webtorrent';
const debug = require('debug')('torrentStore');
const rimraf = require('rimraf');
const parseTorrent = require('parse-torrent');

const BASE_PATH = '/tmp/blizzard/';

export const torrentStore = {
  clients: {},

  getClient(sid: string) {
    if (this.clients[sid] && !this.clients[sid].destroyed) {
      return this.clients[sid];
    } else {
      return this.clients[sid] = new WebTorrent();
    }
  },

  destroyClient(sid: string) {
    if (this.clients[sid]) {
      this.clients[sid].destroy(() => {
        delete this.clients[sid];
        rimraf(`${BASE_PATH}/${sid}`, () => debug(`all torrents/client for ${sid} deleted`));
      });
    }
  },

  getInfoHashFromTorrentId(torrentId: string) {
    return parseTorrent(torrentId).infoHash;
  },

  removeTorrents(sid, infoHash?: string, cb?: Function) {
    const client = this.clients[sid];
    client.torrents.forEach(torrent => {
      if(torrent.infoHash !== infoHash) {
        console.log(torrent.name);
        rimraf(`${BASE_PATH}/${sid}/${torrent.name}`, () => {
          debug(`removed all torrents except ${infoHash}`);
          cb()
        })
      }
    })
  },

  getTorrent(sid: string, torrentId: string) {
    const client = this.getClient(sid);

    // destroy all torrents except infoHash
    const infoHash = parseTorrent(torrentId).infoHash;
    this.removeTorrents(sid, infoHash);

    return client.get(torrentId) || client.add(torrentId, {
        path: `${BASE_PATH}/${sid}`
      })
  }
}
