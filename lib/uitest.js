'use strict';

const co = require('co');
const path = require('path');
const Electron = require('macaca-electron');

module.exports = options => {
  const electron = new Electron();

  return new Promise((resolve, reject) => {
    co(function *() {
      yield electron.startDevice({
        debug: true,
        webPreferences: {
          nodeIntegration: true
        }
      });
      yield electron.setWindowSize(null, options.width, options.height);
      yield electron.get(options.url);
      resolve();
    });
  });
};
