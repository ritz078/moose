import { fadeInTranslateY } from "@utils/animations";
import { animated, config, State } from "react-spring";
import React, { memo, useCallback, useEffect, useState } from "react";
import { IFile } from "../../../types/TorrentDetails";
import { CastEvents } from "../../../shared/constants/CastEvents";
import { ipcRenderer } from "electron";
import styles from "./CastControl.module.scss";
import mStyles from "../MiniPlayer/MiniPlayer.module.scss";
import Icon from "@mdi/react";
import { mdiClose, mdiPause, mdiPlay } from "@mdi/js";
import { showToast } from "@components/Toast";

interface IProps {
  file: IFile;
  onCloseRequest: () => void;
}

async function getVideoDuration(url: string): Promise<number> {
  const video = document.createElement("video");
  video.preload = "metadata";
  return new Promise((resolve) => {
    video.onloadedmetadata = function (metadata) {
      // @ts-ignore
      resolve(metadata?.path?.[0]?.duration);
    };

    video.src = url;
  });
}

export const CastControl: React.FC<IProps> = memo(
  ({ file, onCloseRequest }) => {
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playerState, setPlayerState] = useState(null);

    useEffect(() => {
      function cb(e, msg) {
        showToast(msg);
      }

      ipcRenderer.on("cast-error", cb);
      return () => {
        ipcRenderer.removeListener("cast-error", cb);
      };
    }, []);

    const toggle = useCallback(() => {
      ipcRenderer.send(
        playerState === "PLAYING" ? CastEvents.PAUSE : CastEvents.RESUME
      );
    }, [playerState]);

    const seek = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => {
      ipcRenderer.send(CastEvents.SEEK, e.currentTarget.value);
    }, []);

    const destroy = useCallback(() => {
      ipcRenderer.send(CastEvents.STOP);
      onCloseRequest();
    }, []);

    useEffect(() => {
      if (!file) return;

      (async () => {
        const duration = await getVideoDuration(file.url);
        setDuration(duration);
      })();

      const interval = setInterval(() => {
        ipcRenderer.send(CastEvents.STATUS);
        ipcRenderer.once("cast-progress", (e, { currentTime, playerState }) => {
          setCurrentTime(currentTime);
          setPlayerState(playerState);
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }, [file]);

    const transitions = fadeInTranslateY(!!file, { config: config.wobbly });

    return (
      <>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div
                className={mStyles.miniplayer}
                key={key}
                style={props}
              >
                <div>{file?.name}</div>
                <div className={styles.player}>
                  <Icon
                    onClick={toggle}
                    path={playerState === "PLAYING" ? mdiPause : mdiPlay}
                    color="#fff"
                    size={1}
                  />
                  <div className={styles.progressWrapper}>
                    <input
                      onChange={seek}
                      className={styles.range}
                      value={currentTime}
                      max={duration}
                      type="range"
                    />
                    <progress className={styles.progress} />
                  </div>
                  <span className={styles.duration}>
                    {(currentTime / 60).toFixed(2).toString().replace(".", ":")}{" "}
                    / {(duration / 60).toFixed(2).toString().replace(".", ":")}
                  </span>

                  <Icon
                    onClick={destroy}
                    path={mdiClose}
                    color="#fff"
                    size={0.9}
                  />
                </div>
              </animated.div>
            )
        )}
      </>
    );
  }
);
