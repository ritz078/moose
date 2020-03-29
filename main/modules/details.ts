import TorrentSearchApi from "torrent-search-api";
import { ipcMain } from "electron";
import { TorrentResult } from "../../types/TorrentResult";
import parseTorrent from "parse-torrent";
import WebTorrent, { Torrent } from "webtorrent";
import prettyBytes from "pretty-bytes";
import path from "path";
import { FileType } from "../enums/FileType";
import getPort from "get-port";
import { Server } from "http";

const client = new WebTorrent();

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

function decorateTorrent({ name, files }: Torrent, port: number) {
  return {
    name,
    files: files.map((file, i) => ({
      index: i + 1,
      name: file.name,
      size: prettyBytes(file.length),
      type: getFileType(file),
      url: `http://localhost:${port}/${i}/${encodeURI(file.name)}`,
    })),
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

  const port = await getPort();
  server = _torrent.createServer();
  server.listen(port);

  return decorateTorrent(_torrent, port);
});

function cleanup() {
  if (server) {
    server.close();
  }
  client.destroy();
}

export { cleanup };
