import { FileType } from "../main/enums/FileType";

export interface IFile {
  id: string;
  name: string;
  url?: string;
  size: string;
  index: number;
  type: FileType;
  isMovieOrShow: boolean;
  path: string;
  infoHash: string;
  mime: string;
}

export interface ITorrentDetails {
  files: IFile[];
  name: string;
  infoHash: string;
  size: string;
  isMovieOrShow: boolean;
}

export interface Subtitle {
  lang: string;
  vtt: string;
  url: string;
  filename: string;
  srtPath?: string;
}
