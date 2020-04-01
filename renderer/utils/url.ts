import axios from "axios";
import { IFile, Subtitle } from "../../types/TorrentDetails";

function getApiPort() {
  const { searchParams } = new URL(window.location.href);
  return searchParams.get("port");
}

const baseURL = `${window.location.protocol}//${
  window.location.hostname
}:${getApiPort()}/`;

const instance = axios.create({
  baseURL,
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
  { index, infoHash }: IFile,
  download?: boolean
): Promise<Subtitle[]> {
  const { data } = await instance.get(`/subtitles/${infoHash}/${index}`, {
    params: {
      download,
    },
  });
  return data;
}
