/* eslint-disable no-console,dot-notation */

const express = require('express');
const cors = require('cors');
const { download, list, deleteTorr, searchTorrent } = require('./middleware/torrent');

function startServer() {
  // Create our express based server.
  const app = express();

  app.use(cors());

  app.get('/api/list', list);
  app.get('/api/download/:torrentId/:fileId/:fileName', download);
  app.get('/api/delete/:torrentId', deleteTorr);
  app.get('/api/search/:searchTerm', searchTorrent);

  app.listen(7500, '0.0.0.0');
}

module.exports = startServer;
