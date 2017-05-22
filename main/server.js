/* eslint-disable no-console,dot-notation */

const { app } = require('electron');
const express = require('express');
const next = require('next');
const dev = require('electron-is-dev');
const { resolve } = require('app-root-path');
const { downloadTorrent, list, deleteTorr, searchTorrent } = require('./middleware/torrent');

async function startServer(port) {
  const dir = resolve('./renderer');
  const nextApp = next({ dev, dir });
  const nextHandler = nextApp.getRequestHandler();
  // Create our express based main.

  await nextApp.prepare();

  const server = express();

  server.get('/api/list', list);
  server.get('/api/download/:infoHash/:fileId/:fileName', downloadTorrent);
  server.get('/api/delete/:torrentId', deleteTorr);
  server.get('/api/search/:searchTerm', searchTorrent);

  server.get('/', (req, res) => nextApp.render(req, res, '/', req.query));
  server.get('*', (req, res) => nextHandler(req, res));

  const x = server.listen(port, '0.0.0.0', () => {
    // Make sure to stop the server when the app closes
    // Otherwise it keeps running on its own
    app.on('before-quit', x.close);
  });

  return x;
}

module.exports = startServer;
