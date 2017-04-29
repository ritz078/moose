const { dialog } = require('electron');

exports.error = function (detail, trace, win) {
  // We need to log the error in order to be able to inspect it
  if (trace) {
    console.error(trace);
  }

  dialog.showMessageBox(win || null, {
    type: 'error',
    message: 'An Error Occurred',
    detail,
    buttons: []
  });
};
