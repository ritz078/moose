import { fadeInTranslateY } from "@utils/animations";
import { animated } from "react-spring";
import styles from "@components/MiniPlayer/MiniPlayer.module.scss";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { IFile } from "../../../types/TorrentDetails";
import Plyr, { PlyrEvent } from "plyr";
import cn from "classnames";
import { CastEvents } from "../../../shared/constants/CastEvents";
import { ipcRenderer } from "electron";

const plyrOptions = {
  keyboard: { focused: true, global: true },
  hideControls: false,
  settings: ["captions"],
  volume: 0,
  muted: true,
  storage: {
    enabled: false,
  },
  controls: [
    "play", // Play/pause playback
    "progress", // The progress bar and scrubber for playback and buffering
    "current-time", // The current time of playback
    "duration", // The full duration of the media
  ],
};

interface IProps {
  file: IFile;
}

export const CastControl: React.FC<IProps> = memo(({ file }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr>(null);

  const seek = useCallback((e: PlyrEvent) => {
    ipcRenderer.send(CastEvents.SEEK, e.detail.plyr.currentTime);
  }, []);

  const pause = useCallback((e: PlyrEvent) => {
    ipcRenderer.send(CastEvents.PAUSE);
    playerRef.current.pause();
  }, []);

  const resume = useCallback((e: PlyrEvent) => {
    (async () => {
      if (e.detail.plyr.paused) {
        await playerRef.current.play();
        ipcRenderer.send(CastEvents.RESUME);
      }
    })();
  }, []);

  useEffect(() => {
    if (playerRef.current) playerRef.current?.destroy();
    if (!file) return;

    playerRef.current = new Plyr(videoRef.current, plyrOptions);
    playerRef.current.on("seeking", seek);
    playerRef.current.on("pause", pause);
    playerRef.current.on("play", resume);
  }, [file]);

  const transitions = fadeInTranslateY(!!file);
  console.log(transitions);

  return (
    <>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              className={cn(styles.miniplayer, "castcontrol")}
              key={key}
              style={props}
            >
              <div>{file?.name}</div>
              <video muted autoPlay ref={videoRef} src={file?.url} />
            </animated.div>
          )
      )}
    </>
  );
});
