import chromecasts from "chromecasts";
import dlnacasts from "dlnacasts";

interface Options {
  title?: string;
  type?: string;
  subtitles?: string[];
}

interface Player {
  name: string;
  host: string;
  play: (url: string, opts: Options, cb: (err?: Error) => void) => void;
  pause: (cb?: (err) => void) => void;
  resume: (cb?: (err) => void) => void;
  stop: (cb?: (err) => void) => void;
  seek: (seconds: number, cb?: (err) => void) => void;
  status: (cb: (err, status) => void) => void;
}

export class Cast {
  chromecasts: {
    update: () => void;
    on: (event: "update", player: Player) => void;
    players: Player[];
  };
  dlna: {
    update: () => void;
    on: (event: "update", player: Player) => void;
    players: Player[];
  };

  selected: Player;
  intervalId: number;

  constructor() {
    this.chromecasts = chromecasts();
    this.dlna = dlnacasts();

    // @ts-ignore
    this.intervalId = setInterval(() => {
      this.chromecasts.update();
      this.dlna.update();
    }, 10000);
  }

  get players() {
    this.chromecasts.update();
    this.dlna.update();
    return [...this.chromecasts.players, ...this.dlna.players];
  }

  set selectedPlayer(player: Player) {
    this.selected = player;
  }

  get selectedPlayer() {
    return this.selected;
  }

  async pause() {
    return new Promise((resolve, reject) =>
      this.selected?.pause((err) => {
        err ? reject(err) : resolve();
      })
    );
  }

  async resume() {
    return new Promise((resolve, reject) =>
      this.selected?.resume((err) => {
        err ? reject(err) : resolve();
      })
    );
  }

  async stop() {
    return new Promise((resolve, reject) =>
      this.selected?.stop((err) => {
        err ? reject(err) : resolve();
      })
    );
  }

  async seek(seconds: number) {
    return new Promise((resolve, reject) =>
      this.selected?.seek(seconds, (err) => {
        if (err) return reject(err);
        resolve();
      })
    );
  }

  async status() {
    return new Promise((resolve, reject) =>
      this.selected?.status((err, status) => {
        if (err) return reject(err);
        resolve(status);
      })
    );
  }

  async play(url: string, opts: Options) {
    return new Promise((resolve, reject) => {
      this.selected?.play(url, opts, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }

  destroy() {
    this.stop();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
