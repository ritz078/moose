'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (mime) {
  if (!mime) return null;
  if (mime.indexOf('video') >= 0) {
    return 'video';
  } else if (mime.indexOf('audio') >= 0) {
    return 'audio';
  } else if (mime.indexOf('text') >= 0) {
    return 'text';
  } else if (mime.indexOf('zip') >= 0) {
    return 'zip';
  } else if (mime.indexOf('x-msdownload') >= 0 || mime.indexOf('x-apple-diskimage') >= 0) {
    return 'application';
  } else if (mime.indexOf('image') >= 0) {
    return 'image';
  }
  return null;
};