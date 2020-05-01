import React, { memo, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./DragAndDrop.module.css";
import ParseTorrent from "parse-torrent";
import electron from "electron";
import MagnetUri from "magnet-uri";
import { DropUI } from "@components/DropUI";
import { Download } from "@components/Downloads";
import { parseFileInfo } from "@utils/parseFileInfo";
import { showToast } from "@components/Toast";

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
            showToast(`${magnetUri} is an invalid magnet url.`);
          }
        }
      }

      document.addEventListener("keydown", handlePress);
      return () => {
        document.removeEventListener("keydown", handlePress);
      };
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: File) => {
        const parsedInfo = await parseFileInfo(file);
        onFileSelect(parsedInfo);
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
