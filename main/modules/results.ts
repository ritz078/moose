import TorrentSearchApi from "torrent-search-api";
import { ipcMain } from "electron";

TorrentSearchApi.enableProvider("RarBg");
TorrentSearchApi.enableProvider("ThePirateBay");
ipcMain.handle("getTorrents", async (e, query) => {
  try {
    return TorrentSearchApi.search(query, undefined, 40);
  } catch (e) {
    return e.message;
  }
});

ipcMain.handle("getMagnetUrl", async (e, torrent) => {
  console.log(torrent);
  return TorrentSearchApi.getMagnet(torrent);
});
