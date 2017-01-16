const mime = require('mime');
const rangeParser = require('range-parser');
const WebTorrent = require('webtorrent');
const prettyBytes = require('pretty-bytes');
const TorrentNameParse = require('torrent-name-parse');
const atob = require('atob');
const pump = require('pump');

const client = new WebTorrent()
const parser = new TorrentNameParse()

const a = 'magnet:?xt=urn:btih:1d06e6e2ec7922def8384a25cc901a4bf1a4cb6f&dn=Marvels.Agents.of.S.H.I.E.L.D.S04E09.HDTV.x264-LOL%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969';

function removeTorrents() {
  client.torrents.forEach(torrent => torrent.destroy())
}

export function list(req, res) {
  const torrentId = atob(req.query.torrentId);

  removeTorrents();

  const torrent = client.add(torrentId);
  torrent.on('ready', () => {
    res.json({
      torrentId: torrent.infoHash,
      files: torrent.files.map((file) => ({
        name: file.name,
        size: prettyBytes(file.length)
      })),
      name: torrent.name,
      details: parser.parse(torrent.name)
    })
  })
}

export function download(req, res) {
  const torrent = client.get(req.params.torrentId)

  console.log(req)

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



