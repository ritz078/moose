import { Header } from "../Header";
import React, { useCallback, useState } from "react";
import styles from "./Container.module.css";
import { Download, Downloads } from "@components/Downloads";
import { DragAndDrop } from "@components/DragAndDrop";
import { TorrentDetails } from "@components/TorrentDetails";
import store from "@utils/store";
import { DownloadingTorrent } from "../../../types/DownloadingTorrent";
import { remote } from "electron";

export default function () {
  const [selectedTorrent, setSelectedTorrent] = useState<DownloadingTorrent>(
    null
  );
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [downloads, setDownloads] = useState<Download[]>(
    store.get("torrents") as Download[]
  );

  const onFileSelect = useCallback(({ name, magnet, infoHash }) => {
    setDownloads((_downloads) => {
      if (!!_downloads.find((d) => d.magnet === magnet)) {
        remote.dialog.showMessageBoxSync({
          type: "info",
          message: "This torrent is already added.",
        });
        return _downloads;
      }

      store.set("torrents", [...downloads, { name, magnet, infoHash }]);
      return [...downloads, { name, magnet, infoHash }];
    });
  }, []);

  const onTorrentDelete = useCallback((infoHash) => {
    setDownloads((_downloads) => {
      const newTorrents = _downloads.filter(
        (d) => d.infoHash && d.infoHash !== infoHash
      );

      store.set("torrents", newTorrents);
      const descriptions = store.get("descriptions");
      delete descriptions[infoHash];

      store.set("descriptions", descriptions);
      return newTorrents;
    });
  }, []);

  return (
    <div className={styles.pane}>
      <Header onSearchStatusChange={setIsLoadingResults} />
      <DragAndDrop onFileSelect={onFileSelect}>
        <Downloads
          onTorrentDelete={onTorrentDelete}
          downloads={downloads}
          onTorrentSelect={setSelectedTorrent}
        />

        <TorrentDetails
          infoHash={selectedTorrent?.infoHash}
          name={selectedTorrent?.name}
        />
      </DragAndDrop>
    </div>
  );
}
