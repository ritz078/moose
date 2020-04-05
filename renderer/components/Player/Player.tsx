import Plyr from "plyr";
import React, { memo, useEffect, useRef } from "react";
import { IFile, Subtitle } from "../../../types/TorrentDetails";
import { getStreamingUrl } from "@utils/url";
import styles from "./Player.module.scss";

interface IProps {
  file?: IFile & {
    subtitles?: Subtitle[];
  };
}

export const Player: React.FC<IProps> = memo(({ file }) => {
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!file) return;

    const player = new Plyr(playerRef.current, {
      captions: {
        active: true,
        language: "auto",
        update: false,
      },
    });
    return () => {
      player.destroy();
    };
  }, [file]);

  return (
    <video
      autoPlay
      crossOrigin="anonymous"
      title={name}
      ref={playerRef}
      controls
      playsInline
      className={styles.video}
    >
      <source src={file ? getStreamingUrl(file) : undefined} />
      {file?.subtitles?.map(({ lang, vtt, url }, key) => (
        <track
          key={key}
          kind="subtitles"
          label={lang}
          src={vtt || url}
          default={!key}
        />
      ))}
    </video>
  );
});
