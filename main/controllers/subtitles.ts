// TODO: This file is a work in progress.

import { Request, Response } from "express";
import client from "../utils/webtorrent";
import { flatten } from "lodash";
import { Subtitle } from "../../types/TorrentDetails";
import axios from "axios";
import { writeTemp } from "../utils/temp";
import { getHash } from "../utils/opensubtitle-hash";
import { parse } from "parse-torrent-title";

async function fetchSubtitleFromOS(
  path: string,
  language: string,
  fileName: string,
  { episode, season, title }
) {
  const { movieHash, movieByteSize } = await getHash(path);

  const options = {
    sublanguageid: language,
    moviehash: movieHash,
    moviebytesize: movieByteSize,
    query: encodeURI(title),
    episode,
    season,
  };

  const route = Object.entries(options)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}-${value}`)
    .join("/");

  const { data, status } = await axios.get(
    `https://rest.opensubtitles.org/search/${route}`,
    {
      headers: {
        "X-User-Agent": SUBTITLES,
      },
    }
  );

  return data;
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
  const info = parse(file.name);

  const filePath = `${torrent.path}/${file.path}`;

  const _subTitles: Subtitle[] = await fetchSubtitleFromOS(
    filePath,
    "eng",
    file.name,
    info
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
  console.log(subTitles);
  res.status(200).send(subTitles);
}
