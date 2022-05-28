;(function() {
  'use strict';

  const isPlaywright = true;

  if (!window.__execCommand) {
    window.__execCommand = async ()=>{};
  }

  window._macaca_uitest = {
    switchScene: function() {
      var args = Array.prototype.slice.call(arguments);
      var promise = window.__execCommand('switchScene', args[0]);
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
      var promise = window.__execCommand('switchAllScenes', args[0]);
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
        this.appendToContext(context, `./screenshots/${name}`);
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
      var promise = window.__execCommand('screenshot', './reports/screenshots/' + name);
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

          if (__coverage__) {
            window.__execCommand('saveCoverage', __coverage__);
          }

          // delay to exit
          setTimeout(() => {
            window.__execCommand('exit', { failedCount });
          }, 200);
        }
      });
    }
  };

})();

