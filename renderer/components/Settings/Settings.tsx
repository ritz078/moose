import React, { memo, useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import Popover from "react-tiny-popover";
import styles from "./settings.module.scss";
import { ipcRenderer } from "electron";
import store from "@utils/store";
export default function () {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(store.get("color"));

  useEffect(() => {
    store.set("color", color);
    ipcRenderer.send("preferences-changed-source", { color });
  }, [color]);

  return (
    <div
      className={styles.wrapper}
      style={{
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
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
              onChange={(color) => setColor(color.rgb)}
            />
          )}
        >
          <div
            className={styles.swatch}
            onClick={() => setDisplayColorPicker(true)}
          >
            <div
              className={styles.color}
              style={{
                background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
              }}
            />
          </div>
        </Popover>
      </div>

      {/*<div className={styles.pane}>*/}
      {/*  Download Folder*/}

      {/*  <input type="file"/>*/}
      {/*</div>*/}

      {/*<div className={styles.pane}>*/}
      {/*  Fetch Subtitle from opensubtitles.com*/}

      {/*  <input type="checkbox"/>*/}
      {/*</div>*/}
    </div>
  );
}
