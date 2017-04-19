const { app, BrowserWindow } = require('electron');
const express = require('express');
const next = require('next');
const getPort = require('get-port');
// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

const backendServer = require('./server');

const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();

let win;

function createWindow() {
  nextApp
    .prepare()
    .then(() => {
      getPort(7000).then((port) => {

        const server = express();

        server.get('*', (req, res) => handler(req, res));

        const x = server.listen(port, (error) => {
          if (error) throw error;

          // after the server starts create the electron browser window
          // start building the next.js app
          win = new BrowserWindow({
            height: 768,
            width: 1024,
            maxWidth: 1220,
            minWidth: 400,
            minHeight: 450,
          });

          win.webContents.openDevTools();

          // open our server URL
          win.loadURL(`http://127.0.0.1:${port}`);


          win.on('close', () => {
            // when the windows is closed clear the `win` variable and close the server
            win = null;
            x.close();
          });
        });

        backendServer();
      });
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

