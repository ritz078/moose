import axios, { CancelTokenSource } from "axios";
import { IFile, ITorrentDetails, Subtitle } from "../../types/TorrentDetails";
import { getSubtitlesFromTorrent } from "@utils/getSubtitlesFromTorrent";

function getApiPort() {
  const { searchParams } = new URL(window.location.href);
  return searchParams.get("port");
}

const baseURL = `http://localhost:${getApiPort()}/`;

const instance = axios.create({
  baseURL,
  timeout: 5000,
});

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

let torrentDetailsToken: CancelTokenSource;
export async function getTorrentDetails(infoHash: string) {
  if (torrentDetailsToken) {
    torrentDetailsToken.cancel();
  }

  torrentDetailsToken = axios.CancelToken.source();

  const { data } = await instance.get(`/details/${infoHash}`, {
    timeout: 50000,
    cancelToken: torrentDetailsToken.token,
  });
  return data;
}

let torrentDescriptionToken: CancelTokenSource;
export async function getTorrentDescription(torrentName: string) {
  if (torrentDescriptionToken) torrentDescriptionToken.cancel();

  torrentDescriptionToken = axios.CancelToken.source();
  const { data } = await instance.get("/description", {
    params: {
      name: torrentName,
    },
    cancelToken: torrentDescriptionToken.token,
  });

  return data;
}

let torrentDeleteToken: CancelTokenSource;
export async function deleteTorrent(infoHash: string, deleteLocal: boolean) {
  if (torrentDeleteToken) torrentDeleteToken.cancel();

  torrentDeleteToken = axios.CancelToken.source();
  const { data } = await instance.delete(`/delete/${infoHash}`, {
    params: {
      deleteLocal,
    },
    cancelToken: torrentDeleteToken.token,
  });

  return data;
}
