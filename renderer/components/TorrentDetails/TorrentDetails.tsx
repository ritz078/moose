import React, { useEffect, useState } from "react";
import { TorrentResult } from "../../../types/TorrentResult";
import styles from "./TorrentDetails.module.scss";
import Icon from "@mdi/react";
import { mdiDownload } from "@mdi/js";
import { ITorrentDetails } from "../../../types/TorrentDetails";
import { FilesList } from "@components/FilesList";
import { getTorrentDescription, getTorrentDetails } from "@utils/url";
import { ITorrentDescription } from "../../../types/TorrentDescription";

interface IProps {
  torrent: TorrentResult;
}

export const TorrentDetails: React.FC<IProps> = ({ torrent }) => {
  if (!torrent) return null;
  const [torrentDetails, setTorrentDetails] = useState<ITorrentDetails>(null);
  const [description, setDescription] = useState<ITorrentDescription>(null);

  useEffect(() => {
    setTorrentDetails(null);

    (async () => {
      const details: ITorrentDetails = await getTorrentDetails(torrent);
      setTorrentDetails(details);
    })();

    (async () => {
      const description = await getTorrentDescription(torrent.title);
      setDescription(description);
    })();
  }, [torrent]);

  return (
    <div className={styles.torrentDetails}>
      <img className={styles.poster} src={description?.poster} alt="" />
      <div className={styles.title}>
        <h4>{description?.title}</h4>
        <span>{description?.description}</span>
      </div>

      <FilesList torrentDetails={torrentDetails} />

      <div className={styles.download}>
        <button>
          <Icon
            path={mdiDownload}
            color="#fff"
            size={0.6}
            style={{ marginRight: 5 }}
          />
          Download
        </button>
      </div>
    </div>
  );
};
