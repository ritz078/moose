import Plyr from "plyr";
import React, { memo, useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import styles from "./Player.module.scss";
import { IFile, Subtitle } from "../../../types/TorrentDetails";
import { useTransition, animated } from "react-spring";
import { getStreamingUrl } from "@utils/url";
import { ipcRenderer } from "electron";

interface IProps {
  file?: IFile & {
    subtitles: Subtitle[];
  };
  onCloseRequest: () => void;
}

export const Player: React.FC<IProps> = memo(({ file, onCloseRequest }) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    divRef.current = document.createElement("div");
    document.body.appendChild(divRef.current);

    setIsMounted(true);
    return () => {
      document.body.removeChild(divRef.current);
    };
  }, []);

  useEffect(() => {
    if (!file) return;

    const player = new Plyr(playerRef.current, {
      captions: {
        active: true,
        language: "auto",
        update: false,
      },
    });

    function closePlayer(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRequest();
      }
    }

    document.addEventListener("keydown", closePlayer);
    return () => {
      player.destroy();
      document.removeEventListener("keydown", closePlayer);
    };
  }, [file]);

  const transitions = useTransition(!!file, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    isMounted &&
    ReactDom.createPortal(
      transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              style={props}
              key={key}
              className={styles.playerModal}
            >
              <video
                autoPlay
                crossOrigin="anonymous"
                title={name}
                ref={playerRef}
                controls
                playsInline
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
            </animated.div>
          )
      ),
      divRef.current
    )
  );
});
