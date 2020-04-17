import { Request, Response } from "express";
import client from "../utils/webtorrent";
import OS from "opensubtitles-api";
import { flatten } from "lodash";
import { Subtitle } from "../../types/TorrentDetails";
import axios from "axios";
import { writeTemp } from "../utils/temp";

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
  });

  const options = {
    sublanguageid: language,
    limit: 1,
    hash: info.moviehash,
    filesize: info.moviebytesize,
    path: path,
    filename: fileName,
    gzip: true,
  };

  if (info && info.metadata && info.metadata.imdbid) {
    options["imdbid"] = info.metadata.imdbid;
  }

  return OpenSubtitles.search(options);
}

export async function subtitles(
  req: Request<{
    infoHash: string;
    fileIndex: string;
  }>,
  res: Response
) {
  const { infoHash, fileIndex } = req.params;
  const { download } = req.query;

  const torrent = client.get(infoHash);
  if (!torrent) {
    return res.status(404);
  }

  const file = torrent.files[+fileIndex];
  const filePath = `${torrent.path}/${file.path}`;

  const _subTitles: Subtitle[] = await fetchSubtitleFromOS(
    filePath,
    "eng",
    file.name
  );

  const subTitles = flatten(Object.values(_subTitles));

  if (download) {
    const subTitlePromise = subTitles.map((subtitle) =>
      axios.get(subtitle.vtt, {
        responseType: "text",
      })
    );

    const subtitleContent = await Promise.all(subTitlePromise);
    const response = subtitleContent
      .map((s) => writeTemp(s.data, ".srt"))
      .map((s, i) => ({
        ...subTitles?.[i],
        srtPath: s,
      }));
    return res.status(200).json(response);
  }
  res.status(200).send(subTitles);
}
