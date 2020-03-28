import TorrentSearchApi from "torrent-search-api";
import { ipcMain } from "electron";

TorrentSearchApi.enableProvider("RarBg");

ipcMain.handle("get-torrents", async (e, query) => {
  try {
    const torrents = await TorrentSearchApi.search(query, undefined, 20);

    return torrents;
  } catch (e) {
    return e.message;
  }
});
