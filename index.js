const { app, BrowserWindow } = require('electron')
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer')
const getPort = require('get-port')
const fixPath = require('fix-path')
const dev = require('electron-is-dev')
const { moveToApplications } = require('electron-lets-move');
const Config = require('electron-config')

const config = new Config()

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

const server = require('./main')

let win
let mainWindow

app.setName('Snape')

// Makes sure where inheriting the correct path
// Within the bundled app, the path would otherwise be different
fixPath()

async function createWindow() {
  const port = await getPort()
  // after the main starts create the electron browser window
  // start building the next.js app
  win = new BrowserWindow({
    height: 800,
    width: 1000,
    minWidth: 900,
    vibrancy: 'light',
    titleBarStyle: 'hidden-inset'
  })

  if (dev) {
    installExtension(REACT_DEVELOPER_TOOLS)
    installExtension(REDUX_DEVTOOLS)

    win.webContents.openDevTools()
  }

  server(port, () => {
    // open our main URL
    win.loadURL(`http://127.0.0.1:${port}`)

    win.on('close', () => {
      // when the windows is closed clear the `win` variable and close the main
      win = null
    })
  })

  return win
}

app.on('ready', async () => {
  if (config.get('moveToApplicationsFolder') !== 'never') {
    try {
      const moved = await moveToApplications();
      if (!moved) {
        // the user asked not to move the app, it's up to the parent application
        // to store this information and not hassle them again.
        config.set('moveToApplicationsFolder', 'never')
      }
    } catch (err) {
      // log error, something went wrong whilst moving the app.
    }
  }
  mainWindow = await createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
