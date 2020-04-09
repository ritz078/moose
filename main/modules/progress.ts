import { ipcMain } from "electron";
import client from "../utils/webtorrent";
import download from "downloads-folder";
import prettyBytes from "pretty-bytes";
import timeAgo from "time-ago";

interface Download {
  magnet: string;
  name: string;
}

ipcMain.handle("addTorrentsToDownload", async (e, downloads: Download[]) => {
  const torrents = downloads.map(({ magnet }) => {
    const decodedMagnet = decodeURI(magnet);
    return (
      client.get(decodedMagnet) ||
      client.add(decodedMagnet, {
        path: download(),
      })
    );
  });

  ipcMain.on("progress", (e) => {
    e.returnValue = torrents.map((torrent) => {
      const {
        name,
        progress,
        downloadSpeed,
        numPeers,
        uploadSpeed,
        timeRemaining,
        length,
        infoHash,
      } = client.get(torrent.infoHash) || torrent;
      return {
        name,
        infoHash,
        progress: `${Math.round(progress * 100)}%`,
        downloadSpeed: `${prettyBytes(downloadSpeed)}/s`,
        numPeers,
        uploadSpeed,
        timeRemaining: timeAgo.ago(timeRemaining),
        size: prettyBytes(length),
      };
    });
  });
});
