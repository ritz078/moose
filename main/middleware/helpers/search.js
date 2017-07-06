const PirateBay = require('thepiratebay');
const parseTorrent = require('parse-torrent');

module.exports = async (searchTerm, options) => {
  try {
    const results = await PirateBay.search(searchTerm, options);
    return results.map(r =>
      Object.assign({}, r, {
        infoHash: parseTorrent(r.magnetLink).infoHash,
      }),
    );
  } catch (err) {
    return err.message;
  }
};
