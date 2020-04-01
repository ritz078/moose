import Plyr from "plyr";
import React, { memo, useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import styles from "./Player.module.scss";
import { IFile } from "../../../types/TorrentDetails";
import { useTransition, animated } from "react-spring";
import { Caption } from "@utils/getCaptions";

interface IProps {
  file?: IFile & {
    captions: Caption[];
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
    const player = new Plyr(playerRef.current);

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
                <source src={file?.url} />
                {file?.captions.map(({ name, url }, key) => {
                  return (
                    <track
                      key={key}
                      kind="subtitles"
                      label={name}
                      src={url}
                      default={!key}
                    />
                  );
                })}
              </video>
            </animated.div>
          )
      ),
      divRef.current
    )
  );
});
