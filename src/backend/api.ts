import { list, download } from './torrent';
const util = require('util');

// you would use cookies/token etc
const USER_ID = 'f9d98cf1-1b96-464e-8755-bcc2a5c09077'; // hardcoded as an example

export function listTorrent(req, res) {
  return list(req, res);
}

export function downloadTorrent(req, res) {
  return download(req, res);
}
