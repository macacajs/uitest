;(function() {
  'use strict';

  const isPlaywright = true;

  window._macaca_uitest = {
    switchScene: function() {
      var args = Array.prototype.slice.call(arguments);
      var promise = new Promise((resolve, reject) => {
        // if (!isElectron) {
        //   return resolve();
        // }
        // ipcRenderer.once('ipc', resolve);
        // ipcRenderer.send('ipc', {
        //   action: 'switchScene',
        //   data: args[0]
        // });
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

    switchAllScenes: function() {
      var args = Array.prototype.slice.call(arguments);
      var promise = new Promise((resolve, reject) => {
        // if (!isElectron) {
        //   return resolve();
        // }
        // ipcRenderer.once('ipc', resolve);
        // ipcRenderer.send('ipc', {
        //   action: 'switchAllScenes',
        //   data: args[0]
        // });
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

    saveScreenshot: function(context) {
      var args = Array.prototype.slice.call(arguments);
      var promise = new Promise((resolve, reject) => {
        const name = `${new Date().getTime()}.png`;
        // this.appendToContext(context, `./screenshots/${name}`);
        resolve(this.screenshot(name));
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

    screenshot: function(name) {
      var args = Array.prototype.slice.call(arguments);
      var promise = new Promise((resolve, reject) => {
        // if (!isElectron) {
        //   return resolve();
        // }
        // ipcRenderer.once('ipc', resolve);
        // ipcRenderer.send('ipc', {
        //   action: 'screenshot',
        //   data: {
        //     dir: './reports/screenshots/' + name
        //   }
        // });
        resolve();
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

      if (isPlaywright) {
        mochaOptions = Object.assign({}, options, {
          reporter: 'spec',
          useColors: true
        });
      }

      return mocha.setup(mochaOptions);
    },

    run: function() {
      return mocha.run(function(failedCount) {
        if (isPlaywright) {
          const __coverage__ = window.__coverage__;
          // if (__coverage__) {
          //   const coverageDir = path.join(process.cwd(), 'coverage');
          //   try {
          //     fs.mkdirSync(path.join(coverageDir));
          //     fs.mkdirSync(path.join(coverageDir, '.temp'));
          //   } catch (e) {}
          //   const file = path.join(coverageDir, '.temp', `${+new Date()}_coverage.json`);
          //   // ignore tests
          //   const coverageIgnore = process.env.MACACA_COVERAGE_IGNORE_REG;
          //   if (coverageIgnore) {
          //     const ignoreReg = new RegExp(coverageIgnore, 'i');
          //     for (const k in __coverage__) {
          //       if (ignoreReg.test(k)) {
          //         delete __coverage__[k];
          //       }
          //     }
          //   }
          //   fs.writeFileSync(file, JSON.stringify(__coverage__, null, 2));
          //   console.log(`coverage file created at: ${file}`);
          // }

          // ipcRenderer.send('ipc', {
          //   action: 'exit',
          //   data: {
          //     failedCount
          //   }
          // });
        }
      });
    }
  };

})();

