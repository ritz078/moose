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
import {
  SelectedCastContext,
  Context as castContext,
} from "@contexts/SelectedCast";
import { showToast, Toast } from "@components/Toast";
import { getDefaultColor } from "@utils/theme";
import { parseFileInfo } from "@utils/parseFileInfo";
import fs from "fs";
import MagnetUri from "magnet-uri";
import ParseTorrent from "parse-torrent";

const { searchParams } = new URL(window.location.href);

const path = searchParams.get("path") && decodeURI(searchParams.get("path"));
const magnetUri =
  searchParams.get("magnet") && decodeURI(searchParams.get("magnet"));

export default function () {
  const [selectedTorrent, setSelectedTorrent] = useState<DownloadingTorrent>(
    null
  );
  const [downloads, setDownloads] = useState<Download[]>(
    store.get("torrents") as Download[]
  );

  const [color, setColor] = useState<string>(store.get("color") as string);
  const { selectedCast, setSelectedCast } = useContext(
    SelectedCastContext
  ) as castContext;

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
    function loadFile(path: string) {
      if (!path) return;
      fs.readFile(path, async (err, data) => {
        if (err) return;
        onFileSelect(await parseFileInfo(data));
      });
    }

    loadFile(path);

    function loadFileWhenAppIsOpen(e, path: string) {
      loadFile(path);
    }
    ipcRenderer.on("file-opened", loadFileWhenAppIsOpen);

    return () => {
      ipcRenderer.off("file-opened", loadFileWhenAppIsOpen);
    };
  }, []);

  useEffect(() => {
    function loadMagnetUri(_magnetUri: string) {
      if (!_magnetUri) return;
      try {
        const { name, infoHash }: MagnetUri.Instance = ParseTorrent(_magnetUri);
        onFileSelect({ name: name as string, magnet: _magnetUri, infoHash });
      } catch (e) {
        showToast(`${_magnetUri} is an invalid magnet url.`);
      }
    }

    loadMagnetUri(magnetUri);
    function loadMagnetWhenAppIsOpen(e, url: string) {
      loadMagnetUri(url);
    }
    ipcRenderer.on("magnet-opened", loadMagnetWhenAppIsOpen);

    return () => {
      ipcRenderer.off("magnet-opened", loadMagnetWhenAppIsOpen);
    };
  }, []);

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
        <div className={styles.castMessageContainer}>
          You are connected to {selectedCast?.name}
          <text
            className={styles.disconnectLink}
            onClick={() => setSelectedCast(null)}
          >
            Disconnect
          </text>
        </div>
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
