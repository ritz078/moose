// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
// if you are including modules that modify Promise, such as NewRelic,, you must include them before polyfills
import 'angular2-universal-polyfills';
import 'ts-helpers';
import './__workaround.node'; // temporary until 2.1.1 things are patched in Core

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookie from 'cookie-signature';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as session from 'express-session';
import * as qs from 'query-string';
import * as _ from 'lodash';
import { socketIo } from './backend/helpers/socket';

const http = require('http');

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
import { MainModule } from './node.module';

// Routes
import { routes } from './server.routes';

import { torrentStore } from './backend/helpers/torrentStore';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

const socketToSessionMapping = {}

// Express View
app.engine('.html', createEngine({
  ngModule: MainModule,
  providers: [
    // use only if you have shared state between users
    // { provide: 'LRU', useFactory: () => new LRU(10) }

    // stateless providers only since it's shared
  ]
}));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname);
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(bodyParser.json());
app.use(compression());

const sessionMiddleware = session({
  secret: 'secret',
  name: 'session_name',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false
  }
})

app.use(sessionMiddleware)
app.use(morgan('dev'));

function cacheControl(req, res, next) {
  // instruct browser to revalidate in 60 seconds
  res.header('Cache-Control', 'max-age=60');
  next();
}
// Serve static files
app.use('/assets', cacheControl, express.static(path.join(__dirname, 'assets'), {maxAge: 30}));
app.use(cacheControl, express.static(path.join(ROOT, 'dist/client'), {index: false}));

app.use((req, res, next) => {
  const session: any = req.session;

  let sessionExists = session.sessionExists;

  if (!sessionExists) {
    // new session
    session.sessionExists = true;
  }

  next()
})

//
/////////////////////////
// ** Example API
// Notice API should be in a separate process
import { listTorrent, downloadTorrent } from './backend/api';
// Our API for demos only
app.get('/list', listTorrent);
app.get('/download/:torrentId/:fileId/:fileName', downloadTorrent);

process.on('uncaughtException', function (err) {
  console.error('Catching uncaught errors to avoid process crash', err);
});

function ngApp(req, res) {

  function onHandleError(parentZoneDelegate, currentZone, targetZone, error) {
    console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.html', {root: './src'});
    return false;
  }

  Zone.current.fork({name: 'CSR fallback', onHandleError}).run(() => {
    res.render('index', {
      req,
      res,
      // time: true, // use this to determine what part of your app is slow only in development
      preboot: false,
      baseUrl: '/',
      requestUrl: req.originalUrl,
      originUrl: `http://localhost:${ app.get('port') }`
    });
  });

}

/**
 * use universal for specific routes
 */
app.get('/', ngApp);
routes.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/*`, ngApp);
});

app.get('*', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const pojo = {status: 404, message: 'No Content'};
  const json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = http.createServer(app);

const sio = socketIo.create(server);

sio.set('authorization', (data, accept) => {
  // check if there's a cookie header
  if (data.headers.cookie) {

    const sessionName = qs.parse(data.url.split('?')[1]).session_name;

    // if there is, parse the cookie
    data.headers.sessionID = cookie.unsign(sessionName.slice(2), 'secret'); //hacky from source code
  } else {
    // if there isn't, turn down the connection with a message
    // and leave the function.
    return accept('No cookie transmitted.', false);
  }
  // accept the incoming connection
  accept(null, true);
})

sio.sockets.on("connection", function (socket) {
  const sessionID = socket.handshake.headers.sessionID;

  let mapping: any = socketToSessionMapping[sessionID];

  if (mapping) {
    socketToSessionMapping[sessionID].push(socket.id)
  } else {
    socketToSessionMapping[sessionID] = [socket.id]
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
  })
});

server.listen(app.get('port'), () => {
  console.log(`Listening on: http://localhost:${app.get('port')}`);
})
