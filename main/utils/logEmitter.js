const { BrowserWindow } = require('electron')

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
