import React, { memo } from "react";
import styles from "./Empty.module.scss";
import Icon from "@mdi/react";
import { mdiFilePlus, mdiMagnet } from "@mdi/js";
import { Download } from "@components/Downloads";
import { handleFileSelect } from "@utils/handleFileSelect";
import { handleMagnetSelect } from "@utils/handleMagnetSelect";

interface IProps {
  onFileSelect: (info: Download) => void;
}

export const Empty: React.FC<IProps> = memo(({ onFileSelect }) => {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyInner}>
        <button
          onClick={() => handleFileSelect(onFileSelect)}
          className={styles.button}
          title="Add Torrent File"
        >
          <Icon path={mdiFilePlus} size={2.3} />
        </button>

        <button
          onClick={() => handleMagnetSelect(onFileSelect)}
          className={styles.button}
          title="Add Magnet URL"
        >
          <Icon path={mdiMagnet} size={2.3} />
        </button>
      </div>
    </div>
  );
});
