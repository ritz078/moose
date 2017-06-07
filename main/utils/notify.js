const notifier = require('node-notifier');
const { resolve } = require('app-root-path');

module.exports = (msg) => {
  const icon = resolve('./renderer/static/images/snape.png');
  notifier.notify({
    title: 'Snape',
    message: msg,
    icon,
  });
};
