import React from "react";
import { IFile, Subtitle } from "../../types/TorrentDetails";

interface Context {
  selectedFile: IFile & {
    subtitles?: Subtitle[];
  };
  setSelectedFile: (file: Context["selectedFile"]) => void;
}

export const SelectedFileContext = React.createContext<Context>({
  selectedFile: null,
  setSelectedFile: () => {},
});
