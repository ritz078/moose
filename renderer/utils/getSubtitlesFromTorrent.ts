import { IFile, Subtitle } from "../../types/TorrentDetails";
import { getStreamingUrl } from "@utils/url";
import VTTConverter from "srt-webvtt";
import axios from "axios";

export async function getBlobFromURL(url: string) {
  const { data } = await axios.get(url, {
    responseType: "blob",
  });
  return new VTTConverter(data).getURL();
}

export async function getSubtitlesFromTorrent(
  files: IFile[]
): Promise<Subtitle[]> {
  const hasSRT = files.some((file) => file.name.endsWith(".srt"));
  if (hasSRT) {
    const promises = files
      .filter((file) => file.name.endsWith(".srt"))
      .map(async (file) => {
        const url = getStreamingUrl(file);
        return {
          filename: file.name.replace(".srt", ".vtt"),
          url: url,
          lang: file.name.replace(".srt", ""),
          vtt: await getBlobFromURL(url),
        };
      });

    return Promise.all(promises);
  }

  return null;
}
