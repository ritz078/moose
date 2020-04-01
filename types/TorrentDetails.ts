import { FileType } from "../main/enums/FileType";

export interface IFile {
  name: string;
  url?: string;
  size: string;
  index: number;
  type: boolean | FileType;
  isMovieOrShow: boolean;
  path: string;
  infoHash: string;
}

export interface ITorrentDetails {
  files: IFile[];
  name: string;
  infoHash: string;
}

export interface Subtitle {
  lang: string;
  vtt: string;
  url: string;
  filename: string;
  srtPath?: string;
}
