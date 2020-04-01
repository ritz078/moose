import TorrentSearchApi from "torrent-search-api";
import { ipcMain } from "electron";
import { TorrentResult } from "../../types/TorrentResult";
import parseTorrent from "parse-torrent";
import { Torrent } from "webtorrent";
import prettyBytes from "pretty-bytes";
import path from "path";
import { FileType } from "../enums/FileType";
import { Server } from "http";
import { isMovieOrShow } from "../utils/isMovieOrShow";
import { ITorrentDetails } from "../../types/TorrentDetails";
import client from "../utils/webtorrent";

function getFileExtension(file) {
  const name = typeof file === "string" ? file : file.name;
  return path.extname(name).toLowerCase();
}

function isAudio(file) {
  return (
    [".aac", ".ac3", ".mp3", ".ogg", ".wav", ".flac", ".m4a"].includes(
      getFileExtension(file)
    ) && FileType.AUDIO
  );
}

function isImage(file) {
  return (
    [".jpg", ".jpeg", ".png", ".gif"].includes(getFileExtension(file)) &&
    FileType.IMAGE
  );
}

function isVideo(file) {
  return (
    [
      ".avi",
      ".m4v",
      ".mkv",
      ".mov",
      ".mp4",
      ".mpg",
      ".ogv",
      ".webm",
      ".wmv",
    ].includes(getFileExtension(file)) && FileType.VIDEO
  );
}

function getFileType(file) {
  return isVideo(file) || isAudio(file) || isImage(file);
}

function decorateTorrent({
  name,
  files,
  infoHash,
  path: torrentPath,
}: Torrent): ITorrentDetails {
  return {
    name,
    infoHash,
    files: files.map((file, i) => {
      const _isMovieOrShow = isMovieOrShow(file.name);
      const filePath = `${torrentPath}/${file.path}`;
      return {
        infoHash: infoHash,
        index: i,
        name: file.name,
        size: prettyBytes(file.length),
        type: getFileType(file),
        isMovieOrShow: _isMovieOrShow,
        path: filePath,
      };
    }),
  };
}

let server: Server = null;
ipcMain.handle("getTorrentDetails", async (e, torrent: TorrentResult) => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve();
      });
    });
  }

  const magnet = torrent.magnet || (await TorrentSearchApi.getMagnet(torrent));
  const { infoHash } = parseTorrent(magnet);
  const _torrent: Torrent =
    client.get(infoHash) ||
    (await new Promise((resolve) => {
      client.add(infoHash, resolve);
    }));

  return decorateTorrent(_torrent);
});

function cleanup() {
  client.destroy();
}

export { cleanup };
