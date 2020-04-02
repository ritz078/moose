import { Request, Response } from "express";
import TorrentSearchApi from "torrent-search-api";
import client from "../utils/webtorrent";
import { Torrent } from "webtorrent";
import { ITorrentDetails } from "../../types/TorrentDetails";
import { isMovieOrShow } from "../utils/isMovieOrShow";
import prettyBytes from "pretty-bytes";
import path from "path";
import { FileType } from "../enums/FileType";

export async function details(req: Request, res: Response) {
  try {
    const magnet =
      typeof req.body === "string"
        ? req.body
        : req.body.magnet || (await TorrentSearchApi.getMagnet(req.body));

    const torrent: Torrent =
      client.get(magnet) ||
      (await new Promise((resolve) => client.add(magnet, resolve)));

    // destroy all other torrents.
    client.torrents
      .filter((_torrent) => _torrent.infoHash !== torrent.infoHash)
      .forEach((_torrent) => _torrent.destroy());

    res.json(decorateTorrent(torrent));
  } catch (e) {
    res.send(e.message);
  }
}

function decorateTorrent({
  name,
  files,
  infoHash,
  length,
  path: torrentPath,
}: Torrent): ITorrentDetails {
  return {
    name,
    infoHash,
    size: prettyBytes(length),
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
