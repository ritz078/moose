/* eslint-disable no-console,dot-notation */

import express from 'express';
import session from 'express-session';
import * as http from 'http';
import cors from 'cors';
import cookie from 'cookie-signature';
import qs from 'query-string';
import _ from 'lodash';
import torrentStore from './middleware/helpers/torrentStore';
import socketIo from './middleware/helpers/socketIo';
import { download, list, deleteTorr, searchTorrent } from './middleware/torrent';
import config from '../env-config';

const socketToSessionMapping = {};

// Create our express based server.
const app = express();

const sessionMiddleware = session({
  secret: 'secret',
  name: 'session_name',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
  },
});

app.use(sessionMiddleware);

app.use(cors());

app.get('/api/list', list);
app.get('/api/download/:torrentId/:fileId/:fileName', download);
app.get('/api/delete/:torrentId', deleteTorr);
app.get('/api/search/:searchTerm', searchTorrent);

const server = http.createServer(app);

const sio = socketIo.create(server);

sio.set('authorization', (data, accept) => {
  // check if there's a cookie header
  if (data.headers.cookie) {
    const sessionName = qs.parse(data.url.split('?')[1]).session_name;

    // if there is, parse the cookie
// eslint-disable-next-line no-param-reassign
    data.headers.sessionID = cookie.unsign(sessionName.slice(2), 'secret'); // hacky from source code
  } else {
    // if there isn't, turn down the connection with a message
    // and leave the function.
    return accept('No cookie transmitted.', false);
  }
  // accept the incoming connection
  return accept(null, true);
});

sio.sockets.on('connection', (socket) => {
  const sessionID = socket.handshake.headers.sessionID;

  const mapping = socketToSessionMapping[sessionID];

  if (mapping) {
    socketToSessionMapping[sessionID].push(socket.id);
  } else {
    socketToSessionMapping[sessionID] = [socket.id];
  }

  socket.on('disconnect', () => {
    if (socketToSessionMapping[sessionID]) {
      _.remove(socketToSessionMapping[sessionID], n => n === socket.id);

      if (socketToSessionMapping[sessionID].length === 0) {
        // destroy everything related to that session
        torrentStore.destroyClient(sessionID);
        delete socketToSessionMapping[sessionID];
      }
    }
  });
});

server.listen(config['SERVER_PORT'], '127.0.0.1', () =>
  console.log(`Server listening on port ${config['SERVER_PORT']}`),
);
