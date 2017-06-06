const { BrowserWindow } = require('electron')

/**
 * This file contains functions required to communicate with the renderer to show
 * success or error notifications as a toast. The corresponding renderer file to
 * listen to such events is logReceiver.js
 */

function getWindow() {
  return BrowserWindow.getAllWindows()[0]
}

const logError = (msg) => {
  getWindow().webContents.send('error-main', msg)
}

const logSuccess = (msg) => {
  getWindow().webContents.send('success-main', msg)
}

module.exports = {
  logError,
  logSuccess
}
