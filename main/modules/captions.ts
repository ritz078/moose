import { ipcMain } from "electron";
import OS from "opensubtitles-api";
import client from "../utils/webtorrent";
import tempy from "tempy";
import axios from "axios";

const OpenSubtitles = new OS({
  useragent: "TemporaryUserAgent",
  ssl: true,
});

async function fetchSubtitleFromOS(
  path: string,
  language: string,
  fileName: string
) {
  const info = await OpenSubtitles.identify({
    path: path,
    extend: true,
  });

  const options = {
    sublanguageid: language,
    limit: 1,
    hash: info.moviehash,
    filesize: info.moviebytesize,
    path: path,
    filename: fileName,
    imdbid: null,
  };

  if (info && info.metadata && info.metadata.imdbid) {
    options["imdbid"] = info.metadata.imdbid;
  }

  return OpenSubtitles.search(options);
}

ipcMain.handle("getCaptions", async (e, torrentId, fileIndex) => {
  try {
    const torrent = client.get(torrentId);
    if (!torrent) return;

    const language = "eng";
    const path = `${torrent.path}/${torrent.files[fileIndex].path}`;
    const fileName = torrent.files[fileIndex].name;

    const res = await fetchSubtitleFromOS(path, language, fileName);

    if (res && res.en && res.en[0] && res.en[0].vtt) {
      const { data } = await axios.get(res.en[0].vtt, {
        timeout: 10000,
      });
      return tempy.writeSync(data);
    }

    return null;
  } catch (e) {
    return null;
  }
});
