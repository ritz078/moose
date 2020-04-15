import { ipcMain } from "electron";
import internalIp from "internal-ip";
import { CastEvents } from "../../shared/constants/CastEvents";
import { Cast } from "../utils/Cast";

const casts = new Cast();

ipcMain.on(CastEvents.LIST_DEVICES, (e) => {
  e.returnValue = casts.players;
});

ipcMain.on(CastEvents.SET_CAST_DEVICE, (e, id) => {
  casts.selectedPlayer = id
    ? casts.players.find((cast) => cast.host === id)
    : null;

  e.returnValue = !!casts.selectedPlayer;
});

ipcMain.on(
  CastEvents.PLAY_ON_CAST,
  async (e, id: string, url: string, title) => {
    const ip = await internalIp.v4();
    await casts.play(url.replace("localhost", ip), {
      title,
    });
  }
);

ipcMain.on(CastEvents.SEEK, async (e, time) => {
  console.log(time);
  try {
    await casts.seek(time);
  } catch (e) {}
});

ipcMain.on(CastEvents.PAUSE, () => casts.pause());
ipcMain.on(CastEvents.RESUME, () => casts.resume());
