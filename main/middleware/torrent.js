/* eslint-disable no-param-reassign */
const mime = require('mime');
const rangeParser = require('range-parser');
const prettyBytes = require('pretty-bytes');
const atob = require('atob');
const pump = require('pump');
const config = require('application-config')('Snape');
const torrentStore = require('./helpers/torrentStore');
const search = require('./helpers/search');
const { findIndex } = require('lodash');
const { getTorrent } = require('./download');
const parseTorrent = require('parse-torrent');

function deselectAllFiles(torrent) {
  torrent.files.forEach(file => file.deselect());
}

function stream(req, res, torrent) {
  if (!torrent) {
    res.statusCode = 404;
    return res.end('404 Not Found');
  }

  function onReady() {
    const file = torrent.files[+req.params.fileId];

    if (torrentStore.getTorrent(torrent.infoHash)) {
      torrentStore.removeTorrents(torrent.infoHash);
    }

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', mime.lookup(file.name));

    res.statusCode = 200;

    // Support DLNA streaming
    res.setHeader('transferMode.dlna.org', 'Streaming');
    res.setHeader(
      'contentFeatures.dlna.org',
      'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000'
    );

    let range = rangeParser(file.length, req.headers.range || '');

    if (Array.isArray(range)) {
      range = range[0];
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.length}`);
      res.setHeader('Content-Length', range.end - range.start + 1);
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

function downloadTorrent(req, res) {
  config.read((err, { download }) => {
    const torrentId = req.params.torrentId;
    let torrent;

    // in case the torrent is in the download list then fetch it
    // from there.
    const isPresentInDownloads =
      findIndex(download, (d) => {
        let infoHash;
        try {
          infoHash = parseTorrent(d.magnetLink).infoHash;
        } catch (e) {
          infoHash = null;
        }

        return infoHash === torrentId;
      }) >= 0;

    if (err || !isPresentInDownloads) {
      torrent = torrentStore.getTorrent(torrentId);
    } else {
      torrent = getTorrent(torrentId);
    }

    stream(req, res, torrent);
  });
}

function list(req, res) {
  const torrentId = atob(req.query.torrentId);

  const torrent = torrentStore.getTorrent(torrentId);

  function onReady() {
    deselectAllFiles(torrent);
    res.json({
      torrentId: torrent.infoHash,
      magnetURI: torrent.magnetURI,
      files: torrent.files.map(file => ({
        name: file.name,
        size: prettyBytes(file.length),
        type: mime.lookup(file.name)
      })),
      name: torrent.name
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

function deleteTorr(req, res) {
  torrentStore.removeTorrents();
  res.status(200).end('Torrent file deleted'); // for saving space on main.
}

function searchTorrent(req, res) {
  req.query.page = req.query.page - 1 || 0;

  search(req.params.searchTerm, req.query)
    .then((results) => {
      if (results && !results.length) res.status(500).body({ error: 'Unable to fetch data' });
      return res.json({
        data: results,
        page: req.query.page
      });
    })
    .catch(err => res.json(err));
}

module.exports = {
  list,
  deleteTorr,
  downloadTorrent,
  searchTorrent
};
