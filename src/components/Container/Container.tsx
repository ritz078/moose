import { Header } from "../Header";
import React, { useCallback, useRef, useState } from "react";
import styles from "./Container.module.css";
import { DragAndDrop } from "../DragAndDrop";
import WebTorrent from "webtorrent";

const client = new WebTorrent();

console.log(client);

export default function () {
  const [infoHashes, setInfoHashes] = useState<string[]>([]);

  const wrapperRef = useRef();

  const onFileSelect = useCallback(
    ({ infoHash }) => {
      if (infoHashes.includes(infoHash)) {
        // TODO: Show an error message
        return;
      }

      client.add(infoHash, function (torrent) {
        console.log(torrent);
        // Torrents can contain many files. Let's use the .mp4 file
        const file = torrent.files.find(function (file) {
          return file.name.endsWith(".mp4");
        });

        // Display the file by adding it to the DOM. Supports video, audio, image, etc. files
        file.appendTo(wrapperRef.current);
      });

      setInfoHashes([...infoHashes, infoHash]);
    },
    [infoHashes]
  );

  console.log(infoHashes);
  return (
    <div ref={wrapperRef} className={styles.pane}>
      <Header />
      <DragAndDrop onFileSelect={onFileSelect}>a</DragAndDrop>
    </div>
  );
}
