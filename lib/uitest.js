'use strict';

const Electron = require('macaca-electron');

module.exports = async options => {
  const electron = new Electron();
  const opts = Object.assign({
    debug: true,
    webPreferences: {
      nodeIntegration: true
    }
  }, options);
  console.log(JSON.stringify(opts, null, 2));
  await electron.startDevice(opts);
  await electron.get(options.url);

  await new Promise((resolve, reject) => {
    electron.runnerProcess.once('close', code => {
      if (code) {
        reject(new Error('Electron exit with code ' + code));
      } else {
        resolve();
      }
    });
  });
};
