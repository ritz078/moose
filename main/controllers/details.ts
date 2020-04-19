import { Request, Response } from "express";
import client from "../utils/webtorrent";
import { Torrent } from "webtorrent";
import { ITorrentDetails } from "../../types/TorrentDetails";
import { isMovieOrShow } from "../utils/isMovieOrShow";
import prettyBytes from "pretty-bytes";
import path from "path";
import { FileType } from "../enums/FileType";
import mime from "mime";
import { getUniqueString } from "../utils/temp";

export async function details(req: Request, res: Response) {
  try {
    const { infoHash } = req.params;

    const torrent: Torrent | void = client.get(infoHash);
    if (!torrent) return res.end();

    if (!torrent.files?.length) {
      await new Promise((resolve) => torrent.on("metadata", resolve));
    }

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
  const isTorrentMovieOrShow = files.some((file) => isMovieOrShow(file.name));

  return {
    name,
    infoHash,
    size: prettyBytes(length),
    isMovieOrShow: isTorrentMovieOrShow,
    files: files.map((file, i) => {
      const _isMovieOrShow = isMovieOrShow(file.name);
      const filePath = `${torrentPath}/${file.path}`;
      return {
        id: getUniqueString(),
        infoHash: infoHash,
        index: i,
        name: file.name,
        size: file.length ? prettyBytes(file.length) : "0",
        type: getFileType(file),
        isMovieOrShow: _isMovieOrShow,
        path: filePath,
        mime: mime.getType(file.name),
      };
    }),
  };
}

function getFileExtension(file): string {
  const name = typeof file === "string" ? file : file.name;
  return path.extname(name).toLowerCase();
}

function isAudio(file): FileType {
  return (
    [".aac", ".ac3", ".mp3", ".ogg", ".wav", ".flac", ".m4a"].includes(
      getFileExtension(file)
    ) && FileType.AUDIO
  );
}

function isImage(file): FileType {
  return (
    [".jpg", ".jpeg", ".png", ".gif"].includes(getFileExtension(file)) &&
    FileType.IMAGE
  );
}

export function isVideo(file): FileType {
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
