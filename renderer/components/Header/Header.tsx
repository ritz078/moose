import React, { memo, useCallback } from "react";
import styles from "./Header.module.scss";
import Icon from "@mdi/react";
import { mdiCog, mdiDelete, mdiPlus } from "@mdi/js";
import { Modal } from "@components/Modal";
import { Preferences } from "@components/Preferences";
import store from "@utils/store";
import { remote } from "electron";
import fs from "fs";
import { parseFileInfo } from "@utils/parseFileInfo";
import { Download } from "@components/Downloads";
import { Cast, StreamingDevice } from "@components/Cast/Cast";

interface IProps {
  onFileSelect: (info: Download) => void;
}

export const Header: React.FC<IProps> = memo(({ onFileSelect }) => {
  return (
    <div className={styles.header}>
      <div></div>
      <Navbar onFileSelect={onFileSelect} />
    </div>
  );
});

const Navbar: React.FC<IProps> = memo(({ onFileSelect }) => {
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
        console.log(info);
        onFileSelect(info);
      }
    })();
  }, []);

  return (
    <div className={styles.navbar}>
      <button onClick={loadFile}>
        <Icon
          path={mdiPlus}
          title="Add Torrent File"
          size={0.72}
          color="#fff"
        />
      </button>
      {CAST_SUPPORT && <Cast type={StreamingDevice.CHROMECAST} />}
      <button>
        <Icon path={mdiCog} title="Settings" size={0.72} color="#fff" />
      </button>
      {DEV && (
        <button onClick={() => store.clear()}>
          <Icon
            path={mdiDelete}
            title="Clear storage"
            size={0.72}
            color="#fff"
          />
        </button>
      )}
      <Modal show={false} onCloseRequest={console.log}>
        <Preferences />
      </Modal>
    </div>
  );
});
