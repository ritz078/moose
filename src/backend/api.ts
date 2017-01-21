import { list, download, deleteTorr } from './torrentController';

export function listTorrent(req, res) {
  return list(req, res);
}

export function downloadTorrent(req, res) {
  return download(req, res);
}

export function deleteTorrent(req, res) {
  return deleteTorr(req, res);
}
