import ParseTorrent from "parse-torrent";
import { Buffer } from "buffer";
import { Download } from "@components/Downloads";

export async function parseFileInfo(file: File | Buffer): Promise<Download> {
  if (file instanceof File) {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const parsed = ParseTorrent(Buffer.from(buffer));
        resolve({
          name: parsed.name as string,
          magnet: ParseTorrent.toMagnetURI(parsed),
          infoHash: parsed.infoHash,
        });
      };

      reader.readAsArrayBuffer(file);
    });
  } else {
    const parsed = ParseTorrent(file);
    return Promise.resolve({
      name: parsed.name as string,
      magnet: ParseTorrent.toMagnetURI(parsed),
      infoHash: parsed.infoHash,
    });
  }
}
