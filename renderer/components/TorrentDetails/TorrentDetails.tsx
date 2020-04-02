import React, { useEffect, useState } from "react";
import { TorrentResult } from "../../../types/TorrentResult";
import styles from "./TorrentDetails.module.scss";
import { ipcRenderer } from "electron";
import Icon from "@mdi/react";
import { mdiDownload } from "@mdi/js";
import { ITorrentDetails } from "../../../types/TorrentDetails";
import { FilesList } from "@components/FilesList";
import { getMagnetUrl, getTorrentDetails } from "@utils/url";

interface IProps {
  torrent: TorrentResult;
}

const _torrent = {
  title: "Tears of Steel[SHORT] 2012 BRRip AC3 XViD-RemixHD",
  link:
    "http://itorrents.org/torrent/D05361AD9E0D4BB168B05FFAF9CCE9BA6AC300DB.torrent?title=Tears-of-Steel[SHORT]-2012-BRRip-AC3-XViD-RemixHD",
  seeds: 36,
  peers: 63,
  time: "1 Year+",
  size: "232.92 MB",
  magnet:
    "magnet:?xt=urn:btih:209c8226b299b308beaf2b9cd3fb49212dbd13ec&dn=Tears+of+Steel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Ftears-of-steel.torrent",
};

const description = {
  title: "Tears of Steel",
  Year: "2012",
  rated: "N/A",
  released: "26 Sep 2012",
  runtime: "12 min",
  genre: "Short, Sci-Fi",
  description: "He just wanted to be awesome in space.",
  poster:
    "https://m.media-amazon.com/images/M/MV5BMTczMzQzNDE5NV5BMl5BanBnXkFtZTcwNzYwMzQ1OA@@._V1_SX300.jpg",
};

export const TorrentDetails: React.FC<IProps> = ({ torrent = _torrent }) => {
  if (!torrent) return null;
  const [torrentDetails, setTorrentDetails] = useState<ITorrentDetails>(null);

  useEffect(() => {
    setTorrentDetails(null);

    (async () => {
      const details: ITorrentDetails = await getTorrentDetails(torrent);
      setTorrentDetails(details);
    })();

    (async () => {
      return; // TODO
      const description = await ipcRenderer.invoke(
        "getTorrentDescription",
        torrent.title
      );
      console.log(description);
    })();
  }, [torrent]);

  return (
    <div className={styles.torrentDetails}>
      <img className={styles.poster} src={description.poster} alt="" />
      <div className={styles.title}>
        <h4>{description.title}</h4>
        <span>{description.description}</span>
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
