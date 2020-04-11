import { ipcMain } from "electron";
import client from "../utils/webtorrent";
import download from "downloads-folder";
import prettyBytes from "pretty-bytes";

ipcMain.on("progress", (e, downloads) => {
  const torrents = downloads.map(({ magnet }) => {
    const decodedMagnet = magnet;
    return (
      client.get(decodedMagnet) ||
      client.add(decodedMagnet, {
        path: download(),
      })
    );
  });

  e.returnValue = torrents.map((torrent, i) => {
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
      name: name || downloads[i].name,
      infoHash,
      progress: `${Math.round(progress * 100)}%`,
      downloadSpeed: downloadSpeed ? `${prettyBytes(downloadSpeed)}/s` : 0,
      numPeers,
      uploadSpeed,
      timeRemaining,
      size: length ? prettyBytes(length) : "-",
    };
  });
});
