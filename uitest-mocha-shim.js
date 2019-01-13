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

    // we have to do this so that mocha output doesn't look like shit
    console.log = function () {
      if (/stdout:/.test(arguments[0])) {
        return;
      }

      remoteConsole.log.apply(remoteConsole, arguments);
    };
  }

  window._macaca_uitest = {
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
