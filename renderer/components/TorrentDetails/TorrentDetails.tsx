import React, { useContext, useEffect, useState } from "react";
import styles from "./TorrentDetails.module.scss";
import { ITorrentDetails } from "../../../types/TorrentDetails";
import { FilesList } from "@components/FilesList";
import { getTorrentDescription, getTorrentDetails } from "@utils/url";
import { ITorrentDescription } from "../../../types/TorrentDescription";
import { MiniPlayer } from "@components/MiniPlayer";
import { SelectedFileContext } from "@contexts/SelectedFileContext";
import { FileType } from "@enums/FileType";
import store from "@utils/store";
import { fadeIn, fadeInTranslateY } from "@utils/animations";
import { animated } from "react-spring";
import { SelectedCastContext } from "@contexts/SelectedCast";
import { CastControl } from "@components/CastControl";
import Icon from "@mdi/react";
import { mdiSubtitles } from "@mdi/js";
import cn from "classnames";

interface IProps {
  name: string;
  infoHash: string;
}

export const TorrentDetails: React.FC<IProps> = ({ infoHash, name }) => {
  if (!infoHash) return null;
  const [torrentDetails, setTorrentDetails] = useState<ITorrentDetails>(null);
  const [description, setDescription] = useState<ITorrentDescription>(
    undefined
  );
  const { selectedFile, setSelectedFile } = useContext(SelectedFileContext);
  const { selectedCast } = useContext(SelectedCastContext);

  useEffect(() => {
    (async () => {
      setTorrentDetails(null);
      const details: ITorrentDetails = await getTorrentDetails(infoHash);
      setTorrentDetails(details);
    })();

    (async () => {
      setDescription(undefined);
      let description = store.get("descriptions")[infoHash];

      if (!description) {
        description = await getTorrentDescription(name);
        store.set("descriptions", {
          ...store.get("descriptions"),
          [infoHash]: description,
        });
      }
      setDescription(description);
    })();
  }, [infoHash, name]);

  const isMusic = torrentDetails?.files?.some(
    (file) => file.type === FileType.AUDIO
  );

  const key = `${description?.title}-${torrentDetails?.infoHash}`;

  const transitions = fadeInTranslateY(description !== undefined, {
    keys: key,
  });

  const imageTransitions = fadeIn(description !== undefined, key);

  return (
    <>
      <MiniPlayer file={!selectedCast && selectedFile} />
      <CastControl
        onCloseRequest={() => {
          setSelectedFile(null);
        }}
        file={selectedCast && selectedFile}
      />
      {fadeInTranslateY(!!infoHash).map(
        ({ item, props, key }) =>
          item && (
            <animated.div
              style={props}
              key={key}
              className={styles.torrentDetails}
            >
              {imageTransitions.map(
                ({ item, props, key }) =>
                  item && (
                    <animated.img
                      style={props}
                      key={key}
                      className={styles.poster}
                      src={
                        description?.poster ||
                        (isMusic && "/cover-music.png") ||
                        "/cover-unknown.png"
                      }
                      alt={description?.title}
                    />
                  )
              )}

              <h4 className={styles.header}>
                {description?.title || name}

                <Icon
                  path={mdiSubtitles}
                  color="#fff"
                  size={0.9}
                  className={cn(styles.subtitle, {
                    [styles.subtitlePresent]: torrentDetails?.files.some(
                      (file) =>
                        file.name.endsWith(".srt") || file.name.endsWith(".vtt")
                    ),
                  })}
                />
              </h4>

              {transitions.map(
                ({ item, props, key }) =>
                  item && (
                    <animated.div
                      style={props}
                      key={key}
                      className={styles.animatedWrapper}
                    >
                      {description?.season && (
                        <div className={styles.sub}>
                          {description?.name} &middot;{" "}
                          {`Season ${description?.season}`} &middot;{" "}
                          {`Episode ${description?.episode}`}
                        </div>
                      )}
                      <span>{description?.description}</span>

                      <FilesList
                        torrentDetails={torrentDetails}
                        backdrop={description?.backdrop}
                      />
                    </animated.div>
                  )
              )}
            </animated.div>
          )
      )}
    </>
  );
};
