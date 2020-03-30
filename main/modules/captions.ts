import { ipcMain } from "electron";
import OS from "opensubtitles-api";
import client from "../utils/webtorrent";

const OpenSubtitles = new OS({
  useragent: "caption",
  ssl: true,
});

ipcMain.handle("getCaptions", async (e, torrentId, fileIndex) => {
  const torrent = client.get(torrentId);
  if (!torrent) return;

  const path = `${torrent.path}/${torrent.files[fileIndex].path}`;

  const info = await OpenSubtitles.identify({
    path: path,
    extend: true,
  });

  const options = {
    sublanguageid: "eng",
    limit: 1,
    hash: info.moviehash,
    filesize: info.moviebytesize,
    path: path,
    filename: torrent.files[fileIndex].name,
    imdbid: null,
  };

  if (info && info.metadata && info.metadata.imdbid) {
    options["imdbid"] = info.metadata.imdbid;
  }

  return OpenSubtitles.search(options);
});
