import { Header } from "../Header";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./Container.module.css";
import { Download, Downloads } from "@components/Downloads";
import { DragAndDrop } from "@components/DragAndDrop";
import { TorrentDetails } from "@components/TorrentDetails";
import store from "@utils/store";
import { DownloadingTorrent } from "../../../types/DownloadingTorrent";
import { ipcRenderer, remote } from "electron";
import { Message } from "@components/Message";
import { SelectedCastContext } from "@contexts/SelectedCast";
import { Toast } from "@components/Toast";
import { getDefaultColor } from "@utils/theme";

export default function () {
  const [selectedTorrent, setSelectedTorrent] = useState<DownloadingTorrent>(
    null
  );
  const [downloads, setDownloads] = useState<Download[]>(
    store.get("torrents") as Download[]
  );

  const [color, setColor] = useState(store.get("color"));
  const { selectedCast } = useContext(SelectedCastContext);

  useEffect(() => {
    function changePreferences(e, { color }) {
      setColor(color);
    }

    ipcRenderer.on("preferences-changed", changePreferences);

    return () => {
      ipcRenderer.off("preferences-changed", changePreferences);
    };
  }, []);

  useEffect(() => {
    function updateTheme() {
      store.set("color", getDefaultColor());
      store.set("wasDarkMode", remote.nativeTheme.shouldUseDarkColors);
      setColor(getDefaultColor());
    }

    if (store.get("wasDarkMode") !== remote.nativeTheme.shouldUseDarkColors) {
      updateTheme();
    }

    remote.nativeTheme.addListener("updated", updateTheme);
    return () => {
      remote.nativeTheme.removeListener("updated", updateTheme);
    };
  }, []);

  const onFileSelect = useCallback(
    ({ name, magnet, infoHash }) => {
      setDownloads((_downloads) => {
        if (!!_downloads.find((d) => d.magnet === magnet)) {
          remote.dialog.showMessageBoxSync({
            type: "info",
            message: "This torrent is already added.",
          });
          return _downloads;
        }

        return [..._downloads, { name, magnet, infoHash }];
      });
    },
    [store]
  );

  useEffect(() => {
    store.set("torrents", downloads);
  }, [store, downloads]);

  const onTorrentDelete = useCallback(
    (infoHash) => {
      store.delete(`descriptions.${infoHash}`);

      setDownloads((_downloads) =>
        _downloads.filter((d) => d.infoHash && d.infoHash !== infoHash)
      );
    },
    [store]
  );

  useEffect(() => {
    if (!downloads?.find((d) => d.infoHash === selectedTorrent?.infoHash)) {
      setSelectedTorrent(null);
    }
  }, [downloads, selectedTorrent]);

  return (
    <div
      className={styles.pane}
      style={{
        background: color,
      }}
    >
      <Header onFileSelect={onFileSelect} />
      <Message show={!!selectedCast?.host}>
        You are connected to {selectedCast?.name}
      </Message>
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

      <Toast />
    </div>
  );
}
