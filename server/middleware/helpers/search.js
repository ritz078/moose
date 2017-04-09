const PirateBay = require('thepiratebay');

module.exports = function (searchTerm, options) {
  return new Promise((resolve, reject) => {
    PirateBay.search(searchTerm, options)
      .then(results => resolve(results))
      .catch(err => reject(err));
  });
};
