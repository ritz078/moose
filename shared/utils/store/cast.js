import { remote } from 'electron';
import root from 'window-or-global';
import isRenderer from 'is-electron-renderer';
import ip from 'internal-ip';
import { showToast } from '../../components/Toast';

root.casts = isRenderer ? remote.require('chromecasts')() : require('chromecasts')();

export default {
  get casts() {
    return root.casts;
  },

  set selectedPlayer(x) {
    root.selectedPlayer = x;
  },

  get players() {
    return root.casts.players;
  },

  get selectedPlayer() {
    return root.selectedPlayer;
  },

  connect(player, cb) {
    this.selectedPlayer = player;
    this.selectedPlayer.play(
      `http://${ip.v4()}:${window.location.port}/static/images/cover.jpg`,
      {
        type: 'image/jpeg'
      },
      (err) => {
        if (err) {
          showToast(err.message, 'error');
        }
        if (cb) cb();
      }
    );
  },

  play({ name, type, index, infoHash }, cb) {
    const { selectedPlayer } = root;

    if (selectedPlayer) {
      const src = `http://${ip.v4()}:7500/api/download/${infoHash}/${+index}/${name}`;

      selectedPlayer.play(
        src,
        {
          type,
          title: name
        },
        (err) => {
          if (err) {
            showToast(err.message, 'error');
            this.connect(selectedPlayer);
          }
          if (cb) cb(err);
        }
      );
    }
  },

  set addPlayer(player) {
    window.casts.players.push(player);
  }
};
