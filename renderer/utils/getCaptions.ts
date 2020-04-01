import { ipcRenderer } from "electron";
import { IFile, ITorrentDetails } from "../../types/TorrentDetails";
import axios from "axios";
import VTTConverter from "srt-webvtt";

export interface Caption {
  name?: string;
  url?: string;
}

const LOAD_LOCAL_SRT = true;

async function convertSrtToVtt(srtUrl) {
  const { data } = await axios.get(srtUrl, {
    responseType: "blob",
  });

  return new VTTConverter(data).getURL();
}

export async function getCaptions(
  { isMovieOrShow, index }: IFile,
  torrentDetails: ITorrentDetails,
  callback: (a: boolean) => void,
  forVLC?: boolean
): Promise<(Caption | any)[]> {
  let captions = [];

  const isSRTPresent = torrentDetails.files.some((file) =>
    file.name.endsWith(".srt")
  );

  if (isSRTPresent && !forVLC && LOAD_LOCAL_SRT) {
    // TODO: handle vtt files
    callback(true);
    const srts = torrentDetails.files.filter((file) =>
      file.name.endsWith(".srt")
    );
    const srtUrls = srts.map((file) => file.url);

    const vrtUrls = await Promise.all(srtUrls.map(convertSrtToVtt));

    callback(false);

    return vrtUrls.map((vttUrl, i) => ({
      name: srts[i].name,
      url: vttUrl,
    }));
  }

  if (isMovieOrShow) {
    callback(true);
    captions = await ipcRenderer.invoke(
      "getCaptions",
      torrentDetails.infoHash,
      index - 1,
      forVLC
    );

    callback(false);
  }

  return captions ?? [];
}
