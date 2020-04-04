import axios from "axios";
import { IFile, ITorrentDetails, Subtitle } from "../../types/TorrentDetails";
import { TorrentResult } from "../../types/TorrentResult";
import { getSubtitlesFromTorrent } from "@utils/getSubtitlesFromTorrent";

function getApiPort() {
  const { searchParams } = new URL(window.location.href);
  return searchParams.get("port");
}

const baseURL = `${window.location.protocol}//${
  window.location.hostname
}:${getApiPort()}/`;

const instance = axios.create({
  baseURL,
  timeout: 50000,
});

export async function getSearchResults(query: string) {
  const { data } = await instance.get("/search", {
    params: {
      query,
    },
  });

  return data;
}

export function getStreamingUrl({ index, infoHash, name }: IFile) {
  return `${baseURL}stream/${infoHash}/${index}/${encodeURI(name)}`;
}

export async function getSubtitles(
  { files }: ITorrentDetails,
  { index, infoHash, isMovieOrShow }: IFile,
  download?: boolean
): Promise<Subtitle[]> {
  const subtitles = await getSubtitlesFromTorrent(files);

  if (subtitles) return subtitles;

  if (!isMovieOrShow || !FETCH_SUBTITLES) return [];
  const { data } = await instance.get(`/subtitles/${infoHash}/${index}`, {
    params: {
      download,
    },
  });
  return data;
}

export async function getMagnetUrl(torrent: TorrentResult) {
  const { data } = await instance.post(`/magnet`, torrent);
  return data.magnet;
}

export async function getTorrentDetails(torrent) {
  const { data } = await instance.post("/details", torrent, {
    timeout: 50000,
  });
  return data;
}

export async function getTorrentDescription(torrentName: string) {
  const { data } = await instance.get("/description", {
    params: {
      name: torrentName,
    },
  });

  return data;
}
