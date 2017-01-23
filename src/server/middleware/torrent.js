import torrentStore from './helpers/torrentStore';

const mime = require('mime');
const rangeParser = require('range-parser');
const prettyBytes = require('pretty-bytes');
const atob = require('atob');
const pump = require('pump');

function deselectAllFiles(torrent) {
  torrent.files.forEach(file => file.deselect());
}

export function list(req, res) {
  const torrentId = atob(req.query.torrentId);

  const torrent = torrentStore.getTorrent(req.sessionID, torrentId);

  function onReady() {
    deselectAllFiles(torrent);
    res.json({
      torrentId: torrent.infoHash,
      magnetURI: torrent.magnetURI,
      files: torrent.files.map(file => ({
        name: file.name,
        size: prettyBytes(file.length),
        type: mime.lookup(file.name),
      })),
      name: torrent.name,
    });
  }

  if (torrent.files && torrent.files.length) {
    onReady();
  } else {
    torrent.on('metadata', onReady);
  }

  torrent.on('error', () => {
    res.status(408).end('Request timed out');
  });
}

export function download(req, res) {
  const torrent = torrentStore.getTorrent(req.sessionID, req.params.torrentId);

  if (!torrent) {
    res.statusCode = 404;
    return res.end('404 Not Found');
  }

  function onReady() {
    const file = torrent.files[+req.params.fileId];

    torrentStore.removeTorrents(req.sessionID, torrent.infoHash);

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', mime.lookup(file.name));

    res.statusCode = 200;

    // Support DLNA streaming
    res.setHeader('transferMode.dlna.org', 'Streaming');
    res.setHeader(
      'contentFeatures.dlna.org',
      'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000',
    );

    let range = rangeParser(file.length, req.headers.range || '');

    if (Array.isArray(range)) {
      range = range[0];
      res.statusCode = 206;
      res.setHeader(
        'Content-Range',
        `bytes ${range.start}-${range.end}/${file.length}`,
      );
      res.setHeader('Content-Length', (range.end - range.start) + 1);
    } else {
      range = null;
      res.setHeader('Content-Length', file.length);
    }

    if (req.method === 'HEAD') {
      return res.end();
    }

    res.on('close', res.end);

    return pump(file.createReadStream(range), res);
  }

  if (torrent.ready) {
    return onReady();
  }
  return torrent.on('ready', onReady);
}

export function deleteTorr(req, res) {
  const sessionId = req.sessionID;

  torrentStore.removeTorrents(sessionId);
  res.status(200).end('Torrent file deleted'); // for saving space on server.
}
