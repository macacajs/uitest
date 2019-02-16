;(function() {
  'use strict';

  var isElectron = /Electron/i.test(navigator.userAgent);

  if (!isElectron) {
    console.info('Macaca Electron Environment not support.');
  } else {
    var fs = require('fs');
    var path = require('path');
    var { remote } = require('electron');
    var { ipcRenderer } = require('electron');
    var remoteConsole = remote.require('console');

    var htmldecode = s => {
      var div = document.createElement('div');
      div.innerHTML = s;
      return div.innerText || div.textContent;
    };
    // we have to do this so that mocha output doesn't look like shit
    console.log = function() {
      var args = [].slice.call(arguments);
      if (/stdout:/.test(args[0])) {
        return;
      }
      args = args.map(content => {
        return htmldecode(content);
      });
      remoteConsole.log.apply(remoteConsole, args);
    };
  }

  window._macaca_uitest = {
    switchScene: function() {
      var args = Array.prototype.slice.call(arguments);
      var promise = new Promise((resolve, reject) => {
        ipcRenderer.send('ipc', {
          action: 'switchScene',
          data: args[0],
        });
        setTimeout(() => {
          resolve();
        }, 100);
      });
      if (args.length > 1) {
        var cb = args[1];

        return promise.then(data => {
          cb.call(this, null, data);
        }).catch(err => {
          cb.call(this, `Error occurred: ${err}`);
        });
      } else {
        return promise;
      }
    },

    switchAllScene: function() {
      var args = Array.prototype.slice.call(arguments);
      var promise = new Promise((resolve, reject) => {
        ipcRenderer.send('ipc', {
          action: 'switchAllScenes',
          data: args[0],
        });
        setTimeout(() => {
          resolve();
        }, 100);
      });
      if (args.length > 1) {
        var cb = args[1];

        return promise.then(data => {
          cb.call(this, null, data);
        }).catch(err => {
          cb.call(this, `Error occurred: ${err}`);
        });
      } else {
        return promise;
      }
    },

    saveScreenshot: function(context, cb) {
      const name = `${new Date().getTime()}.png`;
      this.screenshot(name, () => {
        this.appendToContext(context, `./screenshots/${name}`);
        cb();
      });
    },

    screenshot: function(name, cb) {
      if (!isElectron) {
        return cb();
      }

      if (typeof process === 'undefined') {
        return cb();
      }

      setTimeout(function() {
        ipcRenderer.send('ipc', {
          action: 'screenshot',
          data: {
            dir: './reports/screenshots/' + name
          }
        });

        setTimeout(function() {
          cb();
        }, 100);
      }, 100);
    },

    appendToContext: function(mocha, content) {
      try {
        const test = mocha.currentTest || mocha.test;
        if (!test.context) {
          test.context = content;
        } else if (Array.isArray(test.context)) {
          test.context.push(content);
        } else {
          test.context = [test.context];
          test.context.push(content);
        }
      } catch (e) {
        console.log('error', e);
      }
    },

    setup: function(options) {
      var mochaOptions = options;

      if (isElectron) {
        mochaOptions = Object.assign({}, options, {
          reporter: 'spec',
          useColors: true
        });
      }

      return mocha.setup(mochaOptions);
    },

    run: function() {
      return mocha.run(function(failedCount) {
        if (window.__coverage__) {
          const coverageDir = path.join(process.cwd(), 'coverage');
          try {
            fs.mkdirSync(path.join(coverageDir));
            fs.mkdirSync(path.join(coverageDir, '.temp'));
          } catch (e) {}
          const file = path.join(coverageDir, '.temp', `${+new Date()}_coverage.json`);
          // ignore tests
          const testsDir = path.join(process.cwd(), 'tests');
          for (const k in window.__coverage__) {
            if (!!~k.indexOf(testsDir)) {
              delete window.__coverage__[k];
            }
          }
          fs.writeFileSync(file, JSON.stringify(window.__coverage__, null, 2));
          console.log(`coverage file created at: ${file}`);
        }
        if (isElectron) {
          ipcRenderer.send('ipc', {
            action: 'exit',
            data: {
              failedCount,
            }
          });
        }
      });
    }
  };

})();
