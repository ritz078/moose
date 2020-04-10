import React, { memo, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./DragAndDrop.module.css";
import { Buffer } from "buffer";
import ParseTorrent from "parse-torrent";
import electron from "electron";
import MagnetUri from "magnet-uri";
import { DropUI } from "@components/DropUI";
import { Download } from "@components/Downloads";

interface IProps {
  onFileSelect: (torrentInfo: Download) => void;
}

export const DragAndDrop: React.FC<IProps> = memo(
  ({ children, onFileSelect }) => {
    useEffect(() => {
      function handlePress(e: KeyboardEvent) {
        if (e.metaKey && e.code === "KeyV") {
          const magnetUri = electron.remote.clipboard.readText();
          try {
            const { name, infoHash }: MagnetUri.Instance = ParseTorrent(
              magnetUri
            );
            onFileSelect({ name: name as string, magnet: magnetUri, infoHash });
          } catch (e) {
            console.log(`${magnetUri} is an invalid magnet url.`);
          }
        }
      }

      document.addEventListener("keydown", handlePress);
      return () => {
        document.removeEventListener("keydown", handlePress);
      };
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
          const buffer = reader.result as ArrayBuffer;
          const parsed = ParseTorrent(Buffer.from(buffer));
          onFileSelect({
            name: parsed.name as string,
            magnet: ParseTorrent.toMagnetURI(parsed),
            infoHash: parsed.infoHash,
          });
        };

        reader.readAsArrayBuffer(file);
      });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      noClick: true,
    });

    return (
      <div {...getRootProps()} className={styles.dragAndDrop}>
        <input hidden {...getInputProps()} />
        <DropUI isDragActive={isDragActive} />
        {children}
      </div>
    );
  }
);
