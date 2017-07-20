import { remote } from 'electron';
import root from 'window-or-global';
import isRenderer from 'is-electron-renderer';
import ip from 'internal-ip';
import { showToast } from '../components/Toast';

root.casts = isRenderer ? remote.require('chromecasts')() : {};

export function getPlayer() {
  return root.selectedPlayer;
}

export default {
  get casts() {
    return root.casts;
  },

  async connect(player, cb) {
    root.selectedPlayer = player;
    const ipAddr = await ip.v4();
    root.selectedPlayer.play(
      `http://${ipAddr}:${window.location.port}/static/images/cover.png`,
      {
        type: 'image/jpeg',
      },
      (err) => {
        if (err) {
          showToast(err.message, 'error');
        }
        showToast(`Successfully connected to ${player.name}`, 'success');
        if (cb) cb();
      },
    );
  },

  async play({ name, type, index, infoHash }, cb) {
    const { selectedPlayer } = root;

    const ipAddr = await ip.v4();
    if (selectedPlayer) {
      const src = `http://${ipAddr}:${window.location
        .port}/api/download/${infoHash}/${+index}/${name}`;

      selectedPlayer.play(
        src,
        {
          type,
          title: name,
        },
        (err) => {
          if (err) {
            showToast(err.message, 'error');
            this.connect(selectedPlayer);
          }
          if (cb) cb(err);
        },
      );
    }
  },

  destroy(cb) {
    const player = getPlayer();
    if (player) {
      player.stop(() => {
        showToast(`${player.name} has been disconnected.`, 'success');
        root.selectedPlayer = null;
        if (cb) cb();
      });
    }
  },
};
