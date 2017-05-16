const PirateBay = require('thepiratebay');
const parseTorrent = require('parse-torrent');

module.exports = function (searchTerm, options) {
  return new Promise((resolve, reject) => {
    PirateBay.search(searchTerm, options)
      .then((results) => {
        results.forEach((r) => {
          r.infoHash = parseTorrent(r.magnetLink).infoHash;
        });
        return resolve(results);
      })
      .catch(err => reject(err));
  });
};
