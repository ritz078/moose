#!/usr/bin/env node
const meow = require('meow');
const shell = require('shelljs');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({ pkg }).notify();

const cli = meow(`
  Usage
    $ snape <command> [options]
  Commands:
    serve  starts the local server
      --port 
      --host 
  Example:
	  snape serve
`);

if (cli.input[0] === 'serve') {
  shell.exec(`PORT=${cli.flags.port || 3000} HOST=${cli.flags.host || 'localhost'} npm start`);
}
