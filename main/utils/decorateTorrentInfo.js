const prettyBytes = require('pretty-bytes');
const mime = require('mime');
const { sumBy } = require('lodash');

module.exports = function (torrent) {
  const totalSize = sumBy(torrent.files, o => o.length);
  return {
    infoHash: torrent.infoHash,
    magnetURI: torrent.magnetURI,
    size: prettyBytes(totalSize),
    files: torrent.files.map((file, i) => ({
      name: file.name,
      size: prettyBytes(file.length),
      type: mime.lookup(file.name),
      slug: `${torrent.infoHash}/${i}/${file.name}`,
    })),
    name: torrent.name,
  };
};
