import React, { memo, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./DragAndDrop.module.css";
import { Buffer } from "buffer";
import ParseTorrent from "parse-torrent";
import electron from "electron";
import MagnetUri from "magnet-uri";
import { ViewState } from "@enums/ViewState";
import { DropUI } from "@components/DropUI";

interface IProps {
  onFileSelect: (torrentInfo: {
    name: string | string[];
    infoHash: string;
  }) => void;
  viewState: ViewState;
}

export const DragAndDrop: React.FC<IProps> = memo(
  ({ children, onFileSelect, viewState }) => {
    useEffect(() => {
      function handlePress(e: KeyboardEvent) {
        if (e.metaKey && e.code === "KeyV") {
          const magnetUri = electron.remote.clipboard.readText();
          try {
            const { name, infoHash }: MagnetUri.Instance = ParseTorrent(
              magnetUri
            );
            onFileSelect({ name, infoHash });
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
          const { name, infoHash } = ParseTorrent(Buffer.from(buffer));
          onFileSelect({ name, infoHash });
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
        <DropUI
          key={viewState}
          viewState={viewState}
          isDragActive={isDragActive}
        />
        {children}
      </div>
    );
  }
);
