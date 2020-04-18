import { ipcMain } from "electron";
import internalIp from "internal-ip";
import { CastEvents } from "../../shared/constants/CastEvents";
import { Cast } from "../utils/Cast";

const cast = new Cast();

function throwError(message: string, reply: Function) {
  reply("cast-error", message);
}

ipcMain.on(CastEvents.LIST_DEVICES, (e) => {
  e.returnValue = cast.players.map(({ name, host }) => ({
    name,
    host,
  }));
});

ipcMain.on(CastEvents.SET_CAST_DEVICE, (e, id) => {
  try {
    cast.selectedPlayer = id
      ? cast.players.find((cast) => cast.host === id)
      : null;

    e.returnValue = true;
  } catch (e) {
    throwError("This device could not be selected", e);
    e.returnValue = false;
  }
});

ipcMain.on(
  CastEvents.PLAY_ON_CAST,
  async (e, id: string, url: string, opts) => {
    try {
      const ip = await internalIp.v4();
      await cast.play(url.replace("localhost", ip), opts);
    } catch (err) {
      throwError(err.message, e.reply);
    }
  }
);

ipcMain.on(CastEvents.SEEK, async (e, time) => {
  try {
    await cast.seek(time);
  } catch (err) {
    throwError(`This device does not support seeking.`, e.reply);
  }
});

ipcMain.on(CastEvents.PAUSE, async (e) => {
  try {
    await cast.pause();
  } catch (err) {
    throwError(`Unable to pause the media file.`, e.reply);
  }
});

ipcMain.on(CastEvents.STOP, async (e) => {
  try {
    await cast.stop();
  } catch (err) {
    throwError(`Unable to resume the media file.`, e.reply);
  }
});

ipcMain.on(CastEvents.RESUME, async (e) => {
  try {
    await cast.resume();
  } catch (err) {
    throwError(`Unable to resume the media file.`, e.reply);
  }
});

ipcMain.on(CastEvents.STATUS, async (e) => {
  try {
    const status = await cast.status();
    e.reply("cast-progress", status);
  } catch (err) {
    throwError(err.message, e.reply);
  }
});

export function cleanup() {
  cast.destroy();
}
