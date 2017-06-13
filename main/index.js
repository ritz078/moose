const { app, BrowserWindow, Menu } = require('electron');
const getPort = require('get-port');
const fixPath = require('fix-path');
const dev = require('electron-is-dev');
const root = require('window-or-global');
const { moveToApplications } = require('electron-lets-move');
const downloadTorrent = require('./middleware/download');
const template = require('./template');
const { logError } = require('./utils/logEmitter');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

process.on('unhandledRejection', (error) => {
  logError(error);
});

const server = require('./server');
const { addToConfig, readConfig } = require('snape-config');

let win;

app.setName('Snape');

// Makes sure where inheriting the correct path
// Within the bundled app, the path would otherwise be different
fixPath();

const isAlreadyRunning = app.makeSingleInstance(() => {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }

    win.show();
  }
});

if (isAlreadyRunning) {
  app.exit();
}

async function createWindow() {
  let port;
  try {
    port = await getPort();
  } catch (e) {
    console.log(e);
  }
  // after the main starts create the electron browser window
  // start building the next.js app
  win = new BrowserWindow({
    backgroundThrottling: false,
    height: 800,
    backgroundColor: '#ffffff',
    width: 1000,
    minWidth: 1000,
    skipTaskbar: true,
  });

  root.win = win;

  try {
    await server(port);
    downloadTorrent.init();
    if (process.platform === 'darwin') {
      app.dock.show();
    }
  } catch (err) {
    return;
  }

  win.loadURL(`http://localhost:${port}`);

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  if (dev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS);
    installExtension(REDUX_DEVTOOLS);

    // win.webContents.openDevTools(); // crashing the app
  }
}

app.on('ready', async () => {
  readConfig(async (err, { moveToApplicationsFolder }) => {
    if (moveToApplicationsFolder !== 'never') {
      try {
        const moved = await moveToApplications();
        if (!moved) {
          // the user asked not to move the app, it's up to the parent application
          // to store this information and not hassle them again.
          addToConfig({ moveToApplicationsFolder: 'never' });
        }
      } catch (error) {
        // log error, something went wrong whilst moving the app.
      }
    }
  });
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  } else {
    app.exit();
  }
});

app.on('activate', () => {
  if (!win) {
    createWindow();
  }
});
