const {app, BrowserWindow} = require('electron')
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer')
const express = require('express')
const next = require('next')
const getPort = require('get-port')
const fixPath = require('fix-path')
const isDev = require('electron-is-dev')
const {resolve} = require('app-root-path')

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

const backendServer = require('./main')

const dev = process.env.NODE_ENV !== 'production'

const dir = resolve('./renderer')

const nextApp = next({dev, dir})
const handler = nextApp.getRequestHandler()

let win

app.setName('Snape')

// Makes sure where inheriting the correct path
// Within the bundled app, the path would otherwise be different
fixPath()

const windowURL = (page = '') => `${isDev ? 'http://127.0.0.1:7000' : 'next://app'}/${page}`

function createWindow () {
  nextApp.prepare().then(() => {
    getPort(7000).then((port) => {
      const server = express()

      server.get('*', (req, res) => handler(req, res))

      const x = server.listen(port, (error) => {
        if (error) throw error

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

        // open our main URL
        win.loadURL(windowURL())

        win.on('close', () => {
          // when the windows is closed clear the `win` variable and close the main
          win = null
          x.close()
        })
      })

      backendServer()
    })
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
