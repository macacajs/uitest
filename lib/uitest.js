'use strict';

const co = require('co');
const Electron = require('macaca-electron');

module.exports = options => {
  const electron = new Electron();

  return new Promise((resolve, reject) => {
    co(function * () {
      const opts = Object.assign({
        debug: true,
        webPreferences: {
          nodeIntegration: true
        }
      }, options);
      console.log(JSON.stringify(opts, null, 2));
      try {
        yield electron.startDevice(opts);

        yield electron.get(options.url);
      } catch (e) {
        console.log(e.stack);
      }

      electron.runnerProcess.once('close', code => {
        if (code) {
          reject(new Error('Electron exit with code ' + code));
        } else {
          resolve();
        }
      });
    });
  });
};
