import { ipcMain } from "electron";
import internalIp from "internal-ip";
import { Cast, CastDeviceType } from "../utils/Cast";

const chromecast = new Cast(CastDeviceType.CHROMECAST);

ipcMain.on("listCastDevices", (e) => {
  e.returnValue = chromecast.players;
});

ipcMain.on("SET_CAST_DEVICE", (e, id) => {
  chromecast.selectedPlayer = chromecast.players.find(
    (chromecast) => chromecast.host === id
  );

  e.returnValue = !!chromecast.selectedPlayer;
});

ipcMain.on("PLAY_ON_CAST", async (e, id: string, url: string, title) => {
  const ip = await internalIp.v4();
  await chromecast.play(url.replace("localhost", ip), {
    title,
  });
});
