import React, { useCallback, useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import Popover from "react-tiny-popover";
import styles from "./settings.module.scss";
import { ipcRenderer, remote } from "electron";
import store from "@utils/store";
import { activeWindow } from "electron-util";

export default function () {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(store.get("color"));
  const [downloadDir, setDownloadDir] = useState(
    store.get("downloadDirectory")
  );

  useEffect(() => {
    store.set("color", color);
    store.set("downloadDirectory", downloadDir);

    ipcRenderer.send("preferences-changed-source", { color, downloadDir });
  }, [color, downloadDir]);

  const selectDownloadFolder = useCallback(() => {
    const dirPath = remote.dialog.showOpenDialogSync(activeWindow(), {
      title: "Select Download Directory",
      properties: ["openDirectory"],
      buttonLabel: "Select Directory",
    });

    if (dirPath?.length) {
      setDownloadDir(dirPath[0]);
    }
  }, []);

  return (
    <div
      className={styles.wrapper}
      style={{
        background: color,
      }}
    >
      <header className={styles.header}>Preferences</header>
      <div className={styles.pane}>
        Theme
        <Popover
          isOpen={displayColorPicker}
          position="bottom"
          onClickOutside={() => setDisplayColorPicker(false)}
          content={() => (
            <SketchPicker
              color={color}
              onChange={(color) => {
                const { r, g, b, a } = color.rgb;
                setColor(`rgba(${r},${g},${b},${a})`);
              }}
            />
          )}
        >
          {(ref) => (
            <div
              ref={ref}
              className={styles.swatch}
              onClick={() => setDisplayColorPicker(true)}
            >
              <div
                className={styles.color}
                style={{
                  background: color,
                }}
              />
            </div>
          )}
        </Popover>
      </div>

      <div className={styles.pane}>
        Downloads Folder
        <span onClick={selectDownloadFolder} className={styles.value}>
          {downloadDir}
        </span>
      </div>

      {/*<div className={styles.pane}>*/}
      {/*  Fetch Subtitle from opensubtitles.com*/}

      {/*  <input type="checkbox"/>*/}
      {/*</div>*/}
    </div>
  );
}
