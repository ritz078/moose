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

  const onFileSelect = useCallback(
    ({ name, magnet, infoHash }) => {
      if (!!downloads.find((d) => d.magnet === magnet)) {
        remote.dialog.showMessageBoxSync({
          type: "info",
          message: "This torrent is already added.",
        });
        return;
      }

      store.set("torrents", [...downloads, { name, magnet, infoHash }]);
      setDownloads([...downloads, { name, magnet, infoHash }]);
    },
    [downloads]
  );

  const onTorrentDelete = useCallback(
    (infoHash) => {
      debugger;
      const newTorrents = downloads.filter((d) => d.infoHash !== infoHash);

      store.set("torrents", newTorrents);
      setDownloads(newTorrents);
    },
    [downloads]
  );

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
