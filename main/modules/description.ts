import { ipcMain } from "electron";
import { OMDB } from "../helpers/OMDB";

const tvdb = new OMDB();

ipcMain.handle("getTorrentDescription", async (e, info) => {
  const x = await tvdb.find(info);
  return x;
});
