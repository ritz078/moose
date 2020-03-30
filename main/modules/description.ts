import { ipcMain } from "electron";
import parseTorrentName from "parse-torrent-name";
import { OMDB } from "../helpers/OMDB";
import { isMovieOrShow } from "../utils/isMovieOrShow";

const tvdb = new OMDB();

ipcMain.handle("getTorrentDescription", async (e, torrentName) => {
  const info = parseTorrentName(torrentName);
  return isMovieOrShow(torrentName) ? await tvdb.find(info) : null;
});
