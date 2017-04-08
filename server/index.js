/* eslint-disable no-console,dot-notation */

import express from 'express';
import * as http from 'http';
import cors from 'cors';
import { download, list, deleteTorr, searchTorrent } from './middleware/torrent';
import config from '../env-config';

// Create our express based server.
const app = express();

app.use(cors());

app.get('/api/list', list);
app.get('/api/download/:torrentId/:fileId/:fileName', download);
app.get('/api/delete/:torrentId', deleteTorr);
app.get('/api/search/:searchTerm', searchTorrent);

const server = http.createServer(app);

server.listen(config['SERVER_PORT'], '127.0.0.1', () =>
  console.log(`Server listening on port ${config['SERVER_PORT']}`),
);
