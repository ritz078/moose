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
  Example:
	  snape serve
`);

if (cli.input[0] === 'serve') {
  shell.exec('npm start');
}
