import Plyr from "plyr";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { IFile, Subtitle } from "../../../types/TorrentDetails";
import { getStreamingUrl } from "@utils/url";
import styles from "./Player.module.scss";
import Icon from "@mdi/react";
import { mdiContentCopy, mdiOpenInApp, mdiVlc } from "@mdi/js";
import { shell, remote } from "electron";

interface IProps {
  file?: IFile & {
    subtitles?: Subtitle[];
  };
  playOnVlc: (file: IFile) => void;
  backdrop?: string;
}

enum Error {
  AUDIO = "Audio Codec isn't supported.",
  VIDEO = "Video Codec isn't supported.",
  BOTH = "Audio and Video Codecs aren't supported.",
  NONE = "none",
}

export const Player: React.FC<IProps> = memo(
  ({ file, playOnVlc, backdrop }) => {
    const playerRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<Error>(null);
    const plyr = useRef<Plyr>(null);

    useEffect(() => {
      if (!file) return;
      setError(null);
      plyr.current = new Plyr(playerRef.current, {
        captions: {
          active: true,
          language: "auto",
          update: false,
        },
      });
      return () => {
        if (plyr.current) {
          plyr.current.destroy();
          plyr.current = null;
        }
      };
    }, [file]);

    useEffect(() => {
      if (!error || !plyr.current) return;
      if (error === Error.NONE) {
        plyr.current.play();
        return;
      }

      plyr.current.pause();
      plyr.current.toggleControls(false);
    }, [error]);

    const onLoad = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
      // @ts-ignore
      const { audioTracks, videoTracks } = e.target;

      const hasAudioTracks = audioTracks.length;
      const hasVideoTracks = videoTracks.length;
      if (!hasAudioTracks && !hasVideoTracks) {
        return setError(Error.BOTH);
      }
      if (!hasAudioTracks) {
        return setError(Error.AUDIO);
      }
      if (!hasVideoTracks) {
        return setError(Error.VIDEO);
      }

      setError(Error.NONE);
    }, []);

    return (
      <>
        {error && error !== Error.NONE && (
          <div className={styles.errorOverlay}>
            <div className={styles.error}>
              <div>{error}</div>
              <button onClick={() => playOnVlc(file)}>
                <Icon
                  path={mdiVlc}
                  title="Play in VLC"
                  color="white"
                  size={0.8}
                />
              </button>
              <button onClick={() => shell.openPath(file.path)}>
                <Icon
                  path={mdiOpenInApp}
                  title="Open in Default App"
                  color="white"
                  size={0.8}
                />
              </button>
              <button
                onClick={() => {
                  remote.clipboard.writeText(getStreamingUrl(file));
                  new Notification("Copied streaming URL", {
                    body: `of ${file.name}.`,
                  });
                }}
              >
                <Icon
                  path={mdiContentCopy}
                  title="Copy stream URL"
                  color="white"
                  size={0.8}
                />
              </button>
            </div>
          </div>
        )}
        <div
          className={error && error !== Error.NONE ? "player-error" : undefined}
        >
          <video
            poster={backdrop}
            crossOrigin="anonymous"
            title={name}
            ref={playerRef}
            controls
            playsInline
            onLoadedMetadata={onLoad}
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
        </div>
      </>
    );
  }
);
