import React, { memo, useEffect, useRef } from "react";
import Plyr from "plyr";
import styles from "./MiniPlayer.module.scss";
import { IFile } from "../../../types/TorrentDetails";
import { animated } from "react-spring";
import { FileType } from "@enums/FileType";
import { fadeInTranslateY } from "@utils/animations";

interface IProps {
  file: IFile;
}

export const MiniPlayer: React.FC<IProps> = memo(({ file }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<Plyr>(null);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!file || file.type !== FileType.AUDIO) {
      return;
    }

    playerRef.current = new Plyr(audioRef.current);
  }, [file]);

  const transitions = fadeInTranslateY(!!file && file.type === FileType.AUDIO);

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
