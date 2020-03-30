import Plyr from "plyr";
import React, { memo, useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import styles from "./Player.module.scss";
import { IFile } from "../../../types/TorrentDetails";
import { useTransition, animated } from "react-spring";

interface IProps {
  file?: IFile & {
    caption: string;
  };
}

export const Player: React.FC<IProps> = memo(({ file }) => {
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
    return () => {
      player.destroy();
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
                crossOrigin="anonymous"
                title={name}
                ref={playerRef}
                controls
                playsInline
              >
                <source src={file.url} />
                <track
                  kind="captions"
                  label="English captions"
                  src={`${file.caption}.vtt`}
                  srcLang="en"
                  default
                />
              </video>
            </animated.div>
          )
      ),
      divRef.current
    )
  );
});
