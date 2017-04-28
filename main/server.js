/* eslint-disable no-console,dot-notation */

const { app } = require('electron');
const express = require('express');
const next = require('next');
const dev = require('electron-is-dev');
const { resolve } = require('app-root-path');
const { download, list, deleteTorr, searchTorrent } = require('./middleware/torrent');

async function startServer(port, cb) {
  const dir = resolve('./renderer');
  const nextApp = next({ dev, dir });
  const nextHandler = nextApp.getRequestHandler();
  // Create our express based main.

  await nextApp.prepare();

  const server = express();

  server.get('/api/list', list);
  server.get('/api/download/:torrentId/:fileId/:fileName', download);
  server.get('/api/delete/:torrentId', deleteTorr);
  server.get('/api/search/:searchTerm', searchTorrent);

  server.get('/', (req, res) => nextApp.render(req, res, '/', req.query));
  server.get('*', (req, res) => nextHandler(req, res));

  const x = server.listen(port, '0.0.0.0', () => {
    // Make sure to stop the server when the app closes
    // Otherwise it keeps running on its own
    app.on('before-quit', () => x.close());
    cb();
  });
}

module.exports = startServer;
