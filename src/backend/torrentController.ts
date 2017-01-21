const mime = require('mime');
const rangeParser = require('range-parser');
const prettyBytes = require('pretty-bytes');
const atob = require('atob');
const pump = require('pump');

import { torrentStore } from './helpers/torrentStore';

export function list(req, res) {
  const torrentId = atob(req.query.torrentId);

  const torrent = torrentStore.getTorrent(req.sessionID, torrentId);

  if (torrent.ready) {
    onReady()
  } else {
    torrent.on('ready', onReady)
  }

  function onReady() {
    res.json({
      torrentId: torrent.infoHash,
      magnetURI: torrent.magnetURI,
      files: torrent.files.map((file) => ({
        name: file.name,
        size: prettyBytes(file.length),
        type: mime.lookup(file.name)
      })),
      name: torrent.name
    })
  }

  torrent.on('error', () => {
    res.status(408).end('Request timed out')
  })
}

export function download(req, res) {
  const torrent = torrentStore.getTorrent(req.sessionID, req.params.torrentId)

  if (!torrent) {
    res.statusCode = 404;
    return res.end('404 Not Found');
  }

  if (torrent.ready) {
    onReady()
  } else {
    torrent.on('ready', onReady)
  }

  function onReady() {
    const file = torrent.files[+req.params.fileId]

    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Type', mime.lookup(file.name))

    res.statusCode = 200

    // Support DLNA streaming
    res.setHeader('transferMode.dlna.org', 'Streaming')
    res.setHeader(
      'contentFeatures.dlna.org',
      'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000'
    )

    let range = rangeParser(file.length, req.headers.range || '');

    if (Array.isArray(range)) {
      range = range[0];
      res.statusCode = 206;
      res.setHeader(
        'Content-Range',
        'bytes ' + range.start + '-' + range.end + '/' + file.length
      )
      res.setHeader('Content-Length', range.end - range.start + 1)
    } else {
      range = null
      res.setHeader('Content-Length', file.length)
    }

    if (req.method === 'HEAD') {
      return res.end()
    }

    res.on('close', res.end)

    return pump(file.createReadStream(range), res)
  }
}



