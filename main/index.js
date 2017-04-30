const { app, BrowserWindow } = require('electron');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer');
const getPort = require('get-port');
const fixPath = require('fix-path');
const dev = require('electron-is-dev');
const { moveToApplications } = require('electron-lets-move');
const Config = require('electron-config');
const { error: showError } = require('./utils/log');
const downloadTorrent = require('./middleware/download');

const config = new Config();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

const server = require('./server');

let win;

app.setName('Snape');

// Makes sure where inheriting the correct path
// Within the bundled app, the path would otherwise be different
fixPath();

async function createWindow() {
  const port = await getPort();
  // after the main starts create the electron browser window
  // start building the next.js app
  win = new BrowserWindow({
    height: 800,
    width: 1000,
    minWidth: 900,
    vibrancy: 'light',
    titleBarStyle: 'hidden-inset'
  });

  try {
    await server(port);
    downloadTorrent.init();
  } catch (err) {
    showError('Not able to start server', err);
    return;
  }

  win.loadURL(`http://0.0.0.0:${port}`);

  if (dev) {
    installExtension(REACT_DEVELOPER_TOOLS);
    installExtension(REDUX_DEVTOOLS);

    win.webContents.openDevTools();
  }
}

app.on('ready', async () => {
  if (config.get('moveToApplicationsFolder') !== 'never') {
    try {
      const moved = await moveToApplications();
      if (!moved) {
        // the user asked not to move the app, it's up to the parent application
        // to store this information and not hassle them again.
        config.set('moveToApplicationsFolder', 'never');
      }
    } catch (err) {
      // log error, something went wrong whilst moving the app.
    }
  }
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Make sure that unhandled errors get handled
process.on('uncaughtException', (err) => {
  console.error(err);
  showError('Unhandled error appeared', err);
});
