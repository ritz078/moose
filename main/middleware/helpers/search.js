const PirateBay = require('snape-thepiratebay');
const parseTorrent = require('parse-torrent');

module.exports = function (searchTerm, options) {
  return new Promise((resolve, reject) => {
    PirateBay.search(searchTerm, options)
      .then((results) => {
        results.forEach((r) => {
          // eslint-disable-next-line no-param-reassign
          r.infoHash = parseTorrent(r.magnetLink).infoHash;
        });
        return resolve(results);
      })
      .catch((err) => {
        if (err.message === 'None of the proxy requests were successful') {
          reject(err.message);
        } else {
          reject();
        }
      });
  });
};
