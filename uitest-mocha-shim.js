;(function() {
  'use strict';

  if (!window.__execCommand) {
    window.__execCommand = async () => {};
  }

  window._macaca_uitest = {
    mouse: {
      click: function(x, y, opt) {
        return window.__execCommand('mouse', 'click', x, y, opt);
      },
      dblclick: function(x, y, opt) {
        return window.__execCommand('mouse', 'dblclick', x, y, opt);
      },
      move: function(x, y, opt) {
        return window.__execCommand('mouse', 'move', x, y, opt);
      },
      down: function(opt) {
        return window.__execCommand('mouse', 'down', opt);
      },
      up: function(opt) {
        return window.__execCommand('mouse', 'up', opt);
      }
    },
    keyboard: {
      type: function(str, opt) {
        return window.__execCommand('keyboard', 'type', str, opt);
      },
      down: function(key) {
        return window.__execCommand('keyboard', 'down', key);
      },
      up: function(key) {
        return window.__execCommand('keyboard', 'up', key);
      },
      insertText: function(text) {
        return window.__execCommand('keyboard', 'insertText', text);
      },
      press: function(key, opt) {
        return window.__execCommand('keyboard', 'press', key, opt);
      }
    },
    switchScene: function() {
      const args = Array.prototype.slice.call(arguments);
      return window.__execCommand('switchScene', args[0]);
    },

    switchAllScenes: function() {
      const args = Array.prototype.slice.call(arguments);
      return window.__execCommand('switchAllScenes', args[0]);
    },

    saveScreenshot: function(context) {
      return new Promise((resolve, reject) => {
        const name = `${new Date().getTime()}.png`;
        this.appendToContext(context, `./screenshots/${name}`);
        resolve(this.screenshot(name));
      });
    },

    screenshot: function(name) {
      return window.__execCommand('screenshot', './reports/screenshots/' + name);
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

      mochaOptions = Object.assign({}, options, {
        reporter: 'spec',
        useColors: true
      });

      return mocha.setup(mochaOptions);
    },

    run: function() {
      return mocha.run(function(failedCount) {
        const __coverage__ = window.__coverage__;

        if (__coverage__) {
          window.__execCommand('saveCoverage', __coverage__);
        }

        // delay to exit
        setTimeout(() => {
          window.__execCommand('exit', { failedCount });
        }, 200);
      });
    }
  };

})();

