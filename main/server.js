/* eslint-disable no-console,dot-notation */

const { app } = require('electron');
const express = require('express');
const { resolve } = require('app-root-path');
const { downloadTorrent, list, deleteTorr, searchTorrent } = require('./middleware/torrent');

const dev = process.env.NODE_ENV !== 'production';

async function startServer(port) {
  const dir = resolve('./renderer');

  const server = express();

  let nextApp;
  let nextHandler;

  if (dev) {
    const next = require('next');
    nextApp = next({ dev, dir });
    nextHandler = nextApp.getRequestHandler();
    // Create our express based main.

    await nextApp.prepare();
  } else {
    const staticDir = resolve('./build');
    server.use(express.static(staticDir));
  }

  server.get('/api/list', list);
  server.get('/api/download/:infoHash/:fileId/:fileName', downloadTorrent);
  server.get('/api/delete/:torrentId', deleteTorr);
  server.get('/api/search/:searchTerm', searchTorrent);

  if (dev) {
    server.get('/', (req, res) => nextApp.render(req, res, '/', req.query));
    server.get('*', (req, res) => nextHandler(req, res));
  }

  const host = process.platform === 'darwin' ? '0.0.0.0' : '127.0.0.1'; // for chromecast

  const x = server.listen(port, host, () => {
    // Make sure to stop the server when the app closes
    // Otherwise it keeps running on its own
    app.on('close', x.close);
  });

  return x;
}

module.exports = startServer;
