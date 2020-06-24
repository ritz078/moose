import { ipcMain, app } from "electron";
import client from "../utils/webtorrent";
import prettyBytes from "pretty-bytes";
import { Torrent } from "webtorrent";
import { is } from "electron-util";

ipcMain.on("progress", (e, downloads, path) => {
  const torrents = downloads.map(({ magnet }) => {
    const decodedMagnet = magnet;
    return (
      client.get(decodedMagnet) ||
      client.add(decodedMagnet, {
        path,
      })
    );
  });

  if (is.macos) {
    app.dock.setBadge(`${prettyBytes(client.downloadSpeed)}/s`);
  }

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
      ready,
    }: Torrent = client.get(torrent.infoHash) || torrent;
    return {
      index: i,
      name: name || downloads[i].name,
      infoHash,
      progress: `${Math.round(progress * 100)}%`,
      downloadSpeed: downloadSpeed ? `${prettyBytes(downloadSpeed)}/s` : 0,
      numPeers,
      uploadSpeed,
      timeRemaining,
      size: length ? prettyBytes(length) : "-",
      ready,
    };
  });
});
