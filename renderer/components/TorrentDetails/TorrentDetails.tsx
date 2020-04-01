import React, { useEffect, useState } from "react";
import { TorrentResult } from "../../../types/TorrentResult";
import styles from "./TorrentDetails.module.scss";
import { ipcRenderer } from "electron";
import Icon from "@mdi/react";
import { mdiDownload } from "@mdi/js";
import { ITorrentDetails } from "../../../types/TorrentDetails";
import { FilesList } from "@components/FilesList";

interface IProps {
  torrent: TorrentResult;
}

const torrent = {
  title: "Tears of Steel[SHORT] 2012 BRRip AC3 XViD-RemixHD",
  link:
    "http://itorrents.org/torrent/D05361AD9E0D4BB168B05FFAF9CCE9BA6AC300DB.torrent?title=Tears-of-Steel[SHORT]-2012-BRRip-AC3-XViD-RemixHD",
  seeds: 36,
  peers: 63,
  time: "1 Year+",
  size: "232.92 MB",
  magnet:
    "magnet:?xt=urn:btih:88d5b3fdb966781762288cd48c72a9a3e6bbb51e&dn=Parasite.2019.KOREAN.1080p.BluRay.x265-VXT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2860&tr=udp%3A%2F%2F9.rarbg.to%3A2900",
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

export const TorrentDetails: React.FC<IProps> = ({}) => {
  const [torrentDetails, setTorrentDetails] = useState<ITorrentDetails>(null);

  useEffect(() => {
    setTorrentDetails(null);

    (async () => {
      const magnet =
        torrent.magnet || (await ipcRenderer.invoke("getMagnetUrl", torrent));
      const details: ITorrentDetails = await ipcRenderer.invoke(
        "getTorrentDetails",
        { ...torrent, magnet }
      );

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
