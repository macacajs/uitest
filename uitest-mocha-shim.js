;(function() {
  'use strict';

  function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  if (!window.__execCommand) {
    window.__execCommand = async () => {};
  }

  window._macaca_uitest = {
    mouse: {
      click(x, y, opt) {
        return window.__execCommand('mouse', 'click', x, y, opt);
      },
      dblclick(x, y, opt) {
        return window.__execCommand('mouse', 'dblclick', x, y, opt);
      },
      move(x, y, opt) {
        return window.__execCommand('mouse', 'move', x, y, opt);
      },
      down(opt) {
        return window.__execCommand('mouse', 'down', opt);
      },
      up(opt) {
        return window.__execCommand('mouse', 'up', opt);
      }
    },
    keyboard: {
      type(str, opt) {
        return window.__execCommand('keyboard', 'type', str, opt);
      },
      down(key) {
        return window.__execCommand('keyboard', 'down', key);
      },
      up(key) {
        return window.__execCommand('keyboard', 'up', key);
      },
      insertText(text) {
        return window.__execCommand('keyboard', 'insertText', text);
      },
      press(key, opt) {
        return window.__execCommand('keyboard', 'press', key, opt);
      }
    },
    switchScene() {
      const args = Array.prototype.slice.call(arguments);
      return window.__execCommand('switchScene', args[0]);
    },

    switchAllScenes() {
      const args = Array.prototype.slice.call(arguments);
      return window.__execCommand('switchAllScenes', args[0]);
    },

    saveScreenshot(context) {
      return new Promise((resolve, reject) => {
        const name = `${getUUID()}.png`;
        this.appendToContext(context, `./screenshots/${name}`);
        resolve(this.screenshot(name));
      });
    },

    screenshot(name) {
      return window.__execCommand('screenshot', './reports/screenshots/' + name);
    },

    appendToContext(mocha, content) {
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

    setup(options) {
      let mochaOptions = options;

      mochaOptions = Object.assign({}, options, {
        reporter: 'spec',
        useColors: true
      });

      return mocha.setup(mochaOptions);
    },

    run() {
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

