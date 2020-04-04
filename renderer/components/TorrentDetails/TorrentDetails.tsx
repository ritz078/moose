import React, { useContext, useEffect, useState } from "react";
import { TorrentResult } from "../../../types/TorrentResult";
import styles from "./TorrentDetails.module.scss";
import Icon from "@mdi/react";
import { mdiDownload } from "@mdi/js";
import { ITorrentDetails } from "../../../types/TorrentDetails";
import { FilesList } from "@components/FilesList";
import { getTorrentDescription, getTorrentDetails } from "@utils/url";
import { ITorrentDescription } from "../../../types/TorrentDescription";
import { MiniPlayer } from "@components/MiniPlayer";
import { SelectedFileContext } from "@contexts/SelectedFileContext";

interface IProps {
  torrent: TorrentResult;
}

export const TorrentDetails: React.FC<IProps> = ({ torrent }) => {
  if (!torrent) return null;
  const [torrentDetails, setTorrentDetails] = useState<ITorrentDetails>(null);
  const [description, setDescription] = useState<ITorrentDescription>(null);
  const { selectedFile, setSelectedFile } = useContext(SelectedFileContext);

  useEffect(() => {
    (async () => {
      setTorrentDetails(null);
      const details: ITorrentDetails = await getTorrentDetails(torrent);
      setTorrentDetails(details);
    })();

    (async () => {
      setDescription(null);
      const description = await getTorrentDescription(torrent.title);
      setDescription(description);
    })();
  }, [torrent]);

  return (
    <>
      <MiniPlayer file={selectedFile} />
      <div className={styles.torrentDetails}>
        <img
          className={styles.poster}
          src={description?.poster}
          alt={description?.title}
        />
        <div className={styles.title}>
          <h4>{description?.title || torrent.title}</h4>
          <span>{description?.description}</span>
        </div>

        <FilesList torrentDetails={torrentDetails} />

        {torrentDetails && (
          <Icon
            title="Download"
            path={mdiDownload}
            size={0.8}
            className={styles.download}
          />
        )}
      </div>
    </>
  );
};
