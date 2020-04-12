import { Request, Response } from "express";
import mime from "mime";
import rangeParser from "range-parser";
import pump from "pump";
import client from "../utils/webtorrent";

export function stream(
  req: Request<{
    infoHash: string;
    fileIndex: string;
  }>,
  res: Response
) {
  const { infoHash, fileIndex } = req.params;

  const torrent = client.get(infoHash);

  if (!torrent) {
    res.statusCode = 404;
    return res.end("404 Not Found");
  }

  async function onReady() {
    if (!torrent) return;
    const file = torrent.files[+fileIndex];

    res.setHeader("Accept-Ranges", "bytes");

    const mimeType = mime.getType(file.name);
    res.setHeader(
      "Content-Type",
      (mimeType === "video/x-matroska" ? "video/mp4" : mimeType) ||
        "application/octet-stream"
    );

    res.statusCode = 200;

    // Support DLNA streaming
    res.setHeader("transferMode.dlna.org", "Streaming");
    res.setHeader(
      "contentFeatures.dlna.org",
      "DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000"
    );

    const range = rangeParser(file.length, req.headers.range || "");
    let _range;
    if (Array.isArray(range)) {
      _range = range[0];
      res.statusCode = 206;
      res.setHeader(
        "Content-Range",
        `bytes ${_range.start}-${_range.end}/${file.length}`
      );
      res.setHeader("Content-Length", _range.end - _range.start + 1);
    } else {
      _range = null;
      res.setHeader("Content-Length", file.length);
    }

    if (req.method === "HEAD") {
      return res.end();
    }

    return pump(file.createReadStream(_range), res);
  }

  if (torrent.ready) {
    onReady();
  }

  torrent.once("ready", onReady);
  torrent.once("error", () => res.end());

  req.on("close", () => res.end());
}
