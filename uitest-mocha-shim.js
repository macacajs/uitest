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
    stringify: function(obj, replacer, spaces, cycleReplacer) {
      return JSON.stringify(obj, this.serializer(replacer, cycleReplacer), spaces);
    },

    serializer: function(replacer, cycleReplacer) {
      var stack = [];
      var keys = [];

      cycleReplacer = cycleReplacer || function(key, value) {
        if (stack[0] === value) {
          return '[Circular ~]';
        }
        return `[Circular ~.${keys.slice(0, stack.indexOf(value)).join('.')}]`;
      };

      return function(key, value) {
        if (stack.length) {
          var thisPos = stack.indexOf(this);
          ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
          ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);

          if (~stack.indexOf(value)) {
            value = cycleReplacer.call(this, key, value);
          }
        } else {
          stack.push(value);
        }

        return replacer == null ? value : replacer.call(this, key, value);
      };
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
            dir: './test/screenshot/' + name
          }
        });

        setTimeout(function() {
          cb();
        }, 100);
      }, 100);
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
