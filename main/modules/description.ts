import { ipcMain } from "electron";
import { parse } from "parse-torrent-title";
import { OMDB } from "../helpers/OMDB";
import { isMovieOrShow } from "../utils/isMovieOrShow";

const tvdb = new OMDB();

ipcMain.handle("getTorrentDescription", async (e, torrentName) => {
  const info = parse(torrentName);
  return isMovieOrShow(torrentName) ? await tvdb.find(info) : null;
});
