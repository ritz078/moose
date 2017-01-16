const mime = require('mime');
const rangeParser = require('range-parser');
const WebTorrent = require('webtorrent');
const prettyBytes = require('pretty-bytes');
const TorrentNameParse = require('torrent-name-parse');
const atob = require('atob');
const pump = require('pump');

const client = new WebTorrent()
const parser = new TorrentNameParse()

function createTorrent(torrentId) {
  return client.get(torrentId) || client.add(torrentId)
}

export function list(req, res) {
  const torrentId = atob(req.query.torrentId);

  const torrent = createTorrent(torrentId);
  torrent.on('ready', () => {
    res.json({
      torrentId: torrent.infoHash,
      files: torrent.files.map((file) => ({
        name: file.name,
        size: prettyBytes(file.length),
        type: mime.lookup(file.name)
      })),
      name: torrent.name,
      details: parser.parse(torrent.name)
    })
  })
}

export function download(req, res) {
  const torrent = createTorrent(req.params.torrentId)

  if (!torrent) {
    res.statusCode = 404;
    return res.end('404 Not Found');
  }

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

  if(Array.isArray(range)) {
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

  return pump(file.createReadStream(range), res)
}



