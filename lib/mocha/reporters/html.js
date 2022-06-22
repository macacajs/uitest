/* eslint-disable no-bitwise */
'use strict';

/* eslint-env browser */
/**
 * @module HTML
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const utils = require('../utils');
const Progress = require('../browser/progress');
const escapeRe = require('escape-string-regexp');
const escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

/* eslint-disable no-unused-vars, no-native-reassign */
const Date = global.Date;
const setTimeout = global.setTimeout;
const setInterval = global.setInterval;
const clearTimeout = global.clearTimeout;
const clearInterval = global.clearInterval;
/* eslint-enable no-unused-vars, no-native-reassign */

/**
 * Expose `HTML`.
 */

exports = module.exports = HTML;

/**
 * Stats template.
 */

const statsTemplate =
  '<ul id="mocha-stats">' +
  '<li class="progress"><canvas width="40" height="40"></canvas></li>' +
  '<li class="passes"><a href="javascript:void(0);">passes:</a> <em>0</em></li>' +
  '<li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li>' +
  '<li class="duration">duration: <em>0</em>s</li>' +
  '</ul>';

const playIcon = '&#x2023;';

/**
 * Initialize a new `HTML` reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @augments Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function HTML(runner) {
  Base.call(this, runner);

  const self = this;
  const stats = this.stats;
  const stat = fragment(statsTemplate);
  const items = stat.getElementsByTagName('li');
  const passes = items[1].getElementsByTagName('em')[0];
  const passesLink = items[1].getElementsByTagName('a')[0];
  const failures = items[2].getElementsByTagName('em')[0];
  const failuresLink = items[2].getElementsByTagName('a')[0];
  const duration = items[3].getElementsByTagName('em')[0];
  const canvas = stat.getElementsByTagName('canvas')[0];
  const report = fragment('<ul id="mocha-report"></ul>');
  const stack = [report];
  let progress;
  let ctx;
  const root = document.getElementById('mocha');

  if (canvas.getContext) {
    const ratio = window.devicePixelRatio || 1;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
    canvas.width *= ratio;
    canvas.height *= ratio;
    ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    progress = new Progress();
  }

  if (!root) {
    return error('#mocha div missing, add it to your document');
  }

  // pass toggle
  on(passesLink, 'click', function(evt) {
    evt.preventDefault();
    unhide();
    const name = /pass/.test(report.className) ? '' : ' pass';
    report.className = report.className.replace(/fail|pass/g, '') + name;
    if (report.className.trim()) {
      hideSuitesWithout('test pass');
    }
  });

  // failure toggle
  on(failuresLink, 'click', function(evt) {
    evt.preventDefault();
    unhide();
    const name = /fail/.test(report.className) ? '' : ' fail';
    report.className = report.className.replace(/fail|pass/g, '') + name;
    if (report.className.trim()) {
      hideSuitesWithout('test fail');
    }
  });

  root.appendChild(stat);
  root.appendChild(report);

  if (progress) {
    progress.size(40);
  }

  runner.on('suite', function(suite) {
    if (suite.root) {
      return;
    }

    // suite
    const url = self.suiteURL(suite);
    const el = fragment(
      '<li class="suite"><h1><a href="%s">%s</a></h1></li>',
      url,
      escape(suite.title)
    );

    // container
    stack[0].appendChild(el);
    stack.unshift(document.createElement('ul'));
    el.appendChild(stack[0]);
  });

  runner.on('suite end', function(suite) {
    if (suite.root) {
      updateStats();
      return;
    }
    stack.shift();
  });

  runner.on('pass', function(test) {
    const url = self.testURL(test);
    const markup =
      '<li class="test pass %e"><h2>%e<span class="duration">%ems</span> ' +
      '<a href="%s" class="replay">' +
      playIcon +
      '</a></h2></li>';
    const el = fragment(markup, test.speed, test.title, test.duration, url);
    self.addCodeToggle(el, test.body);
    appendToStack(el);
    updateStats();
  });

  runner.on('fail', function(test) {
    const el = fragment(
      '<li class="test fail"><h2>%e <a href="%e" class="replay">' +
        playIcon +
        '</a></h2></li>',
      test.title,
      self.testURL(test)
    );
    let stackString; // Note: Includes leading newline
    let message = test.err.toString();

    // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
    // check for the result of the stringifying.
    if (message === '[object Error]') {
      message = test.err.message;
    }

    if (test.err.stack) {
      const indexOfMessage = test.err.stack.indexOf(test.err.message);
      if (indexOfMessage === -1) {
        stackString = test.err.stack;
      } else {
        stackString = test.err.stack.substr(
          test.err.message.length + indexOfMessage
        );
      }
    } else if (test.err.sourceURL && test.err.line !== undefined) {
      // Safari doesn't give you a stack. Let's at least provide a source line.
      stackString = '\n(' + test.err.sourceURL + ':' + test.err.line + ')';
    }

    stackString = stackString || '';

    if (test.err.htmlMessage && stackString) {
      el.appendChild(
        fragment(
          '<div class="html-error">%s\n<pre class="error">%e</pre></div>',
          test.err.htmlMessage,
          stackString
        )
      );
    } else if (test.err.htmlMessage) {
      el.appendChild(
        fragment('<div class="html-error">%s</div>', test.err.htmlMessage)
      );
    } else {
      el.appendChild(
        fragment('<pre class="error">%e%e</pre>', message, stackString)
      );
    }

    self.addCodeToggle(el, test.body);
    appendToStack(el);
    updateStats();
  });

  runner.on('pending', function(test) {
    const el = fragment(
      '<li class="test pass pending"><h2>%e</h2></li>',
      test.title
    );
    appendToStack(el);
    updateStats();
  });

  function appendToStack(el) {
    // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.
    if (stack[0]) {
      stack[0].appendChild(el);
    }
  }

  function updateStats() {
    // TODO: add to stats
    const percent = (stats.tests / runner.total * 100) | 0;
    if (progress) {
      progress.update(percent).draw(ctx);
    }

    // update stats
    const ms = new Date() - stats.start;
    text(passes, stats.passes);
    text(failures, stats.failures);
    text(duration, (ms / 1000).toFixed(2));
  }
}

/**
 * Makes a URL, preserving querystring ("search") parameters.
 *
 * @param {string} s
 * @return {string} A new URL.
 */
function makeUrl(s) {
  let search = window.location.search;

  // Remove previous grep query parameter if present
  if (search) {
    search = search.replace(/[?&]grep=[^&\s]*/g, '').replace(/^&/, '?');
  }

  return (
    window.location.pathname +
    (search ? search + '&' : '?') +
    'grep=' +
    encodeURIComponent(escapeRe(s))
  );
}

/**
 * Provide suite URL.
 *
 * @param {Object} [suite]
 */
HTML.prototype.suiteURL = function(suite) {
  return makeUrl(suite.fullTitle());
};

/**
 * Provide test URL.
 *
 * @param {Object} [test]
 */
HTML.prototype.testURL = function(test) {
  return makeUrl(test.fullTitle());
};

/**
 * Adds code toggle functionality for the provided test's list element.
 *
 * @param {HTMLLIElement} el
 * @param {string} contents
 */
HTML.prototype.addCodeToggle = function(el, contents) {
  const h2 = el.getElementsByTagName('h2')[0];
  let pre;

  on(h2, 'click', function() {
    pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
  });

  pre = fragment('<pre><code>%e</code></pre>', utils.clean(contents));
  el.appendChild(pre);
  pre.style.display = 'none';
};

/**
 * Display error `msg`.
 *
 * @param {string} msg
 */
function error(msg) {
  document.body.appendChild(fragment('<div id="mocha-error">%s</div>', msg));
}

/**
 * Return a DOM fragment from `html`.
 *
 * @param {string} html
 */
function fragment(html) {
  const args = arguments;
  const div = document.createElement('div');
  let i = 1;

  div.innerHTML = html.replace(/%([se])/g, function(_, type) {
    switch (type) {
      case 's':
        return String(args[i++]);
      case 'e':
        return escape(args[i++]);
      // no default
    }
  });

  return div.firstChild;
}

/**
 * Check for suites that do not have elements
 * with `classname`, and hide them.
 *
 * @param {text} classname
 */
function hideSuitesWithout(classname) {
  const suites = document.getElementsByClassName('suite');
  for (let i = 0; i < suites.length; i++) {
    const els = suites[i].getElementsByClassName(classname);
    if (!els.length) {
      suites[i].className += ' hidden';
    }
  }
}

/**
 * Unhide .hidden suites.
 */
function unhide() {
  const els = document.getElementsByClassName('suite hidden');
  for (let i = 0; i < els.length; ++i) {
    els[i].className = els[i].className.replace('suite hidden', 'suite');
  }
}

/**
 * Set an element's text contents.
 *
 * @param {HTMLElement} el
 * @param {string} contents
 */
function text(el, contents) {
  if (el.textContent) {
    el.textContent = contents;
  } else {
    el.innerText = contents;
  }
}

/**
 * Listen on `event` with callback `fn`.
 */
function on(el, event, fn) {
  if (el.addEventListener) {
    el.addEventListener(event, fn, false);
  } else {
    el.attachEvent('on' + event, fn);
  }
}
