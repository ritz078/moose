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
  provider: "Rarbg",
  title: "Parasite.2019.KOREAN.1080p.BluRay.H264.AAC-VXT",
  time: "2019-11-29 10:40:31 +0000",
  seeds: 1962,
  peers: 225,
  size: "2.5 GiB",
  magnet:
    "magnet:?xt=urn:btih:66b8ac047bb6c15914038673234313612449f5d6&dn=Parasite.2019.KOREAN.1080p.BluRay.H264.AAC-VXT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
  desc:
    "https://torrentapi.org/redirect_to_info.php?token=zxqm8od5st&p=2_0_7_0_5_7_8__66b8ac047b",
};

const description = {
  title: "Parasite",
  description:
    "A poor family, the Kims, con their way into becoming the servants of a rich family, the Parks. But their easy life gets complicated when their deception is threatened with exposure.",
  poster:
    "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  year: "2019",
  runtime: "132 min",
  rated: "R",
  released: "08 Nov 2019",
  genre: "Comedy, Drama, Thriller",
};

export const TorrentDetails: React.FC<IProps> = ({}) => {
  const [torrentDetails, setTorrentDetails] = useState<ITorrentDetails>(null);

  useEffect(() => {
    setTorrentDetails(null);

    (async () => {
      const details: ITorrentDetails = await ipcRenderer.invoke(
        "getTorrentDetails",
        torrent
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
