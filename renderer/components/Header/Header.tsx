import React, { memo, useCallback, useRef, useState } from "react";
import styles from "./Header.module.scss";
import Icon from "@mdi/react";
import { mdiAlertCircleOutline, mdiDelete, mdiMagnet, mdiPlus } from "@mdi/js";
import { Modal } from "@components/Modal";
import { Preferences } from "@components/Preferences";
import store from "@utils/store";
import { remote } from "electron";
import { Download } from "@components/Downloads";
import { Cast, StreamingDevice } from "@components/Cast/Cast";
import { is, openNewGitHubIssue } from "electron-util";
import { handleFileSelect } from "@utils/handleFileSelect";
import { handleMagnetSelect } from "@utils/handleMagnetSelect";

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
  return (
    <div className={styles.navbar}>
      <button
        onClick={() => handleFileSelect(onFileSelect)}
        title="Add Torrent File"
      >
        <Icon path={mdiPlus} size={0.72} color="#fff" />
      </button>

      <button
        onClick={() => handleMagnetSelect(onFileSelect)}
        title="Add Magnet URL"
      >
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
        title="Open a GitHub Issue"
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
    </div>
  );
});
