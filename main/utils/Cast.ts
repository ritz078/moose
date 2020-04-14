import chromecasts from "chromecasts";
import dlnacasts from "dlnacasts";

export enum CastDeviceType {
  DLNA = 1,
  CHROMECAST,
}

interface Options {
  title?: string;
  type?: string;
  subtitles?: string[];
}

interface Player {
  name: string;
  host: string;
  play: (url: string, opts: Options, cb: (err?: Error) => void) => void;
  pause: (cb?: () => void) => void;
  resume: (cb?: () => void) => void;
  stop: (cb?: () => void) => void;
  seek: (seconds: number, cb?: () => void) => void;
  status: (cb: () => void) => void;
}

export class Cast {
  list: {
    update: () => void;
    on: (event: "update", player: Player) => void;
    players: Player[];
  };

  selected: Player;

  constructor(type: CastDeviceType) {
    this.list =
      type === CastDeviceType.CHROMECAST ? chromecasts() : dlnacasts();
  }

  get players(): Player[] {
    return this.list.players;
  }

  set selectedPlayer(player: Player) {
    this.selected = player;
  }

  get selectedPlayer() {
    return this.selected;
  }

  async pause() {
    return new Promise(this.selected?.pause);
  }

  async resume() {
    return new Promise(this.selected?.resume);
  }

  async stop() {
    return new Promise(this.selected?.resume);
  }

  async seek(seconds: number) {
    return new Promise((resolve) => this.selected?.seek(seconds, resolve));
  }

  async status() {
    return new Promise(this.selected?.resume);
  }

  async play(url: string, opts: Options) {
    return new Promise((resolve, reject) => {
      this.selected?.play(url, opts, (err) => {
        err ? reject(err) : resolve(err);
      });
    });
  }
}
