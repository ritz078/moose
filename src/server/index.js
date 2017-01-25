/* eslint-disable no-console */

import express from 'express';
import compression from 'compression';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import session from 'express-session';
import * as http from 'http';
import * as cookie from 'cookie-signature';
import * as qs from 'query-string';
import * as _ from 'lodash';
import reactApplication from './middleware/reactApplication';
import security from './middleware/security';
import clientBundle from './middleware/clientBundle';
import serviceWorker from './middleware/serviceWorker';
import offlinePage from './middleware/offlinePage';
import errorHandlers from './middleware/errorHandlers';
import config from '../../config';
import torrentStore from './middleware/helpers/torrentStore';
import socketIo from './middleware/helpers/socketIo';
import { download, list, deleteTorr } from './middleware/torrent';

const MongoStore = require('connect-mongo')(session);

const socketToSessionMapping = {};

// Create our express based server.
const app = express();

// Don't expose any software information to potential hackers.
app.disable('x-powered-by');

// Security middlewares.
app.use(...security);

// Gzip compress the responses.
app.use(compression());

const sessionMiddleware = session({
  secret: 'secret',
  name: 'session_name',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/blizzard',
  }),
  cookie: {
    httpOnly: false,
  },
});

app.use(sessionMiddleware);


// When in production mode, we will serve our service worker which was generated
// by the offline-plugin webpack plugin. See the webpack plugins section for
// more information.
// Note: the service worker needs to be served from the http root of your
// application for it to work correctly.
if (process.env.NODE_ENV === 'production'
  && config.serviceWorker.enabled) {
  app.get(`/${config.serviceWorker.fileName}`, serviceWorker);
  app.get(
    `${config.bundles.client.webPath}${config.serviceWorker.offlinePageFileName}`,
    offlinePage,
  );
}

app.get('/list', list);
app.get('/download/:torrentId/:fileId/:fileName', download);
app.get('/delete/:torrentId', deleteTorr);

// Configure serving of our client bundle.
app.use(config.bundles.client.webPath, clientBundle);

// Configure static serving of our "public" root http path static files.
// Note: these will be served off the root (i.e. '/') of our application.
app.use(express.static(pathResolve(appRootDir.get(), config.publicAssetsPath)));

// The React application middleware.
app.get('*', reactApplication);

// Error Handler middlewares.
app.use(...errorHandlers);

const server = http.createServer(app);

const sio = socketIo.create(server);

sio.set('authorization', (data, accept) => {
  // check if there's a cookie header
  if (data.headers.cookie) {
    const sessionName = qs.parse(data.url.split('?')[1]).session_name;

    // if there is, parse the cookie
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

server.listen(config.port, config.host, () =>
  console.log(`Server listening on port ${config.port}`),
);

// We export the listener as it will be handy for our development hot reloader,
// or for exposing a general extension layer for application customisations.
export default server;
