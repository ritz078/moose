export interface TorrentResult {
  title: string;
  time: string | Date;
  magnet?: string;
  seeds: number;
}
