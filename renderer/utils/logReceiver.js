import { ipcRenderer } from 'electron'
import isRenderer from 'is-electron-renderer'
import { showToast } from '../components/Toast'

/**
 * The corresponding main file (sender) is logEmitter.js
 */

export default function initLogReceivers() {
  if (!isRenderer) return
  ipcRenderer.on('success-main', (e, msg) => showToast(msg, 'success'))

  ipcRenderer.on('error-main', (e, msg) => showToast(msg, 'error'))
}
