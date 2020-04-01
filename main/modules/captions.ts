import { ipcMain } from "electron";
import OS from "opensubtitles-api";
import client from "../utils/webtorrent";
import axios from "axios";
import path from "path";
import fs from "fs";

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

ipcMain.handle(
  "getCaptions",
  async (e, torrentId: string, fileIndex: number, forVLC: boolean) => {
    try {
      const torrent = client.get(torrentId);
      if (!torrent) return;

      const language = "eng";
      const _path = `${torrent.path}/${torrent.files[fileIndex].path}`;
      const fileName = torrent.files[fileIndex].name;

      const res = await fetchSubtitleFromOS(_path, language, fileName);
      console.log(res, fileName);

      if (res?.en?.[0]?.url) {
        if (forVLC) {
          const { data } = await axios.get(res.en[0].url, {
            timeout: 10000,
          });

          const srtPath = path.resolve(_path, "..", `${fileName}.srt`);
          fs.writeFileSync(srtPath, data, {
            encoding: "utf-8",
          });
        }
        return [{ name: res.en[0].lang, url: res.en[0].url }];
      }

      return null;
    } catch (e) {
      return null;
    }
  }
);
