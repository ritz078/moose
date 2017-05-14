const { app, BrowserWindow, Menu } = require('electron');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer');
const getPort = require('get-port');
const fixPath = require('fix-path');
const dev = require('electron-is-dev');
const { moveToApplications } = require('electron-lets-move');
const config = require('application-config')('Snape');
const { error: showError } = require('./utils/log');
const downloadTorrent = require('./middleware/download');
const template = require('./template');

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
    backgroundThrottling: false,
    height: 800,
    width: 1000,
    minWidth: 900,
    titleBarStyle: 'hidden-inset',
    skipTaskbar: true
  });

  try {
    await server(port);
    downloadTorrent.init();
    app.dock.show();
  } catch (err) {
    showError('Not able to start server', err);
    return;
  }

  win.loadURL(`http://0.0.0.0:${port}`);

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  if (dev) {
    installExtension(REACT_DEVELOPER_TOOLS);
    installExtension(REDUX_DEVTOOLS);

    win.webContents.openDevTools();
  }
}

app.on('ready', async () => {
  config.read(async (err, { moveToApplicationsFolder }) => {
    if (moveToApplicationsFolder !== 'never') {
      try {
        const moved = await moveToApplications();
        if (!moved) {
          // the user asked not to move the app, it's up to the parent application
          // to store this information and not hassle them again.
          config.write({ moveToApplicationsFolder: 'never' });
        }
      } catch (error) {
        // log error, something went wrong whilst moving the app.
      }
    }
  });
  await createWindow();
});

app.on('window-all-closed', () => {
  app.dock.hide();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!win) {
    createWindow();
  }
});

// Make sure that unhandled errors get handled
process.on('uncaughtException', (err) => {
  showError('Unhandled error appeared', err);
});
