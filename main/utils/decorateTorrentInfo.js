const prettyBytes = require('pretty-bytes');
const mime = require('mime');
const { sumBy } = require('lodash');

module.exports = (torrent) => {
  const totalSize = sumBy(torrent.files, o => o.length);
  return {
    infoHash: torrent.infoHash,
    magnetURI: torrent.magnetURI,
    size: prettyBytes(totalSize),
    files: torrent.files.map((file, i) => ({
      name: file.name,
      size: prettyBytes(file.length),
      type: mime.getType(file.name),
      slug: `${torrent.infoHash}/${i}/${encodeURI(file.name)}`,
    })),
    name: torrent.name,
  };
};
