import React, { memo, useEffect, useRef } from "react";
import Plyr from "plyr";
import styles from "./MiniPlayer.module.scss";
import { IFile } from "../../../types/TorrentDetails";
import { useTransition, animated } from "react-spring";
import { getStreamingUrl } from "@utils/url";
import { FileType } from "@enums/FileType";

interface IProps {
  file: IFile;
}

export const MiniPlayer: React.FC<IProps> = memo(({ file }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<Plyr>(null);

  useEffect(() => {
    if (!file || file.type !== FileType.AUDIO) {
      playerRef.current?.destroy();
      return;
    }
    if (playerRef.current) {
      playerRef.current.source = {
        type: "audio",
        sources: [{ src: getStreamingUrl(file) }],
      };
    } else if (file) {
      playerRef.current = new Plyr(audioRef.current);
    }
  }, [file]);

  const transitions = useTransition(
    !!file && file.type === FileType.AUDIO,
    null,
    {
      from: { opacity: 0, transform: "translateY(20px)" },
      enter: { opacity: 1, transform: "translateY(0)" },
      leave: { opacity: 0, transform: "translateY(20px)" },
    }
  );

  return (
    <>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className={styles.miniplayer} key={key} style={props}>
              <div>{file?.name?.replace(".mp3", "")}</div>
              <audio autoPlay ref={audioRef} src={file?.url} />
            </animated.div>
          )
      )}
    </>
  );
});
