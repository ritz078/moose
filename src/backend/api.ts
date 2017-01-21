import { list, download } from './torrentController';

export function listTorrent(req, res) {
  return list(req, res);
}

export function downloadTorrent(req, res) {
  return download(req, res);
}
