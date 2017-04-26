import { showToast } from '../components/Toast';

export function logError(err) {
  return err && showToast(err.message, 'error');
}

export function logWarning(message) {
  return message && showToast(message, 'warning');
}
