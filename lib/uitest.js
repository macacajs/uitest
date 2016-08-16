'use strict';

const co = require('co');
const Electron = require('macaca-electron');

module.exports = options => {
  const electron = new Electron();

  return new Promise((resolve, reject) => {
    co(function *() {
      yield electron.startDevice(Object.assign({
        debug: true,
        webPreferences: {
          nodeIntegration: true
        }
      }, options));

      yield electron.get(options.url);

      electron.runnerProcess.once('close', code => {
        code ? reject(new Error('Electron exit with code ' + code)) : resolve();
      });
    });
  });
};
