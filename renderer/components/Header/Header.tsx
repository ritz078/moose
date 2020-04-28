import React, { memo, useCallback, useRef, useState } from "react";
import styles from "./Header.module.scss";
import Icon from "@mdi/react";
import { mdiAlertCircleOutline, mdiDelete, mdiMagnet, mdiPlus } from "@mdi/js";
import { Modal } from "@components/Modal";
import { Preferences } from "@components/Preferences";
import store from "@utils/store";
import { remote } from "electron";
import fs from "fs";
import { parseFileInfo } from "@utils/parseFileInfo";
import { Download } from "@components/Downloads";
import { Cast, StreamingDevice } from "@components/Cast/Cast";
import { is, openNewGitHubIssue } from "electron-util";
import parseTorrent from "parse-torrent";
import { showToast, Toast } from "@components/Toast";
import MagnetUri from "magnet-uri";

interface IProps {
  onFileSelect: (info: Download) => void;
}

export const Header: React.FC<IProps> = memo(({ onFileSelect }) => {
  return (
    <div className={styles.header}>
      <div />
      <Navbar onFileSelect={onFileSelect} />
    </div>
  );
});

const Navbar: React.FC<IProps> = memo(({ onFileSelect }) => {
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);

  const loadFile = useCallback(() => {
    (async function () {
      const { filePaths } = await remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {
          properties: ["openFile"],
          filters: [
            {
              name: "torrent",
              extensions: ["torrent"],
            },
          ],
          message: "Load Torrent File",
        }
      );

      if (filePaths.length) {
        const info = await parseFileInfo(fs.readFileSync(filePaths[0]));
        onFileSelect(info);
      }
    })();
  }, []);

  return (
    <div className={styles.navbar}>
      <button onClick={loadFile} title="Add Torrent File">
        <Icon path={mdiPlus} size={0.72} color="#fff" />
      </button>

      <button onClick={() => setShow(true)} title="Add Torrent File">
        <Icon path={mdiMagnet} size={0.72} color="#fff" />
      </button>

      <Cast type={StreamingDevice.CHROMECAST} />
      <button
        onClick={() =>
          openNewGitHubIssue({
            user: "ritz078",
            repo: remote.app.name,
          })
        }
        title="Create a new GitHub Issue"
      >
        <Icon path={mdiAlertCircleOutline} size={0.72} color="#fff" />
      </button>
      {is.development && (
        <button
          onClick={() => {
            store.clear();
            window.location.reload();
          }}
          title="Clear storage"
        >
          <Icon path={mdiDelete} size={0.72} color="#fff" />
        </button>
      )}
      <Modal show={false} onCloseRequest={console.log}>
        <Preferences />
      </Modal>

      <Modal show={show} onCloseRequest={() => setShow(false)}>
        <div className={styles.addMagnet}>
          <h4>Enter Magnet URL</h4>
          <div>
            <input
              autoFocus
              ref={inputRef}
              type="text"
              onKeyDown={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
            />
            <button
              onClick={() => {
                const magnet = inputRef.current.value;
                try {
                  const { name, infoHash }: MagnetUri.Instance = parseTorrent(
                    magnet
                  );
                  onFileSelect({
                    name: name as string,
                    infoHash,
                    magnet,
                  });
                  setShow(false);
                } catch (e) {
                  showToast(`"${e.message}" is an invalid magnet url.`);
                }
              }}
            >
              Load
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
});
