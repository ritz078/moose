import * as WebTorrent from 'webtorrent';


export const torrentStore = {
  clients: {},

  getClient(sid: string) {
    if(this.clients[sid] && !this.clients[sid].destroyed) {
      return this.clients[sid]
    } else {
      return this.clients[sid] = new WebTorrent();
    }
  },

  destroyClient(sid: string) {
    if(this.clients[sid]) {
      this.clients[sid].destroy(() => delete this.clients[sid]);
    }
  },

  getTorrent(sid: string, torrentId: string) {
    const client = this.getClient(sid);
    return client.get(torrentId) || client.add(torrentId)
  }
}
