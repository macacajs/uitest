'use strict';
/**
 * @module XUnit
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const utils = require('../utils');
const inherits = utils.inherits;
const fs = require('fs');
const escape = utils.escape;
const mkdirp = require('mkdirp');
const path = require('path');

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
 * Expose `XUnit`.
 */

exports = module.exports = XUnit;

/**
 * Initialize a new `XUnit` reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @augments Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function XUnit(runner, options) {
  Base.call(this, runner);

  const stats = this.stats;
  const tests = [];
  const self = this;

  // the name of the test suite, as it will appear in the resulting XML file
  let suiteName;

  // the default name of the test suite if none is provided
  const DEFAULT_SUITE_NAME = 'Mocha Tests';

  if (options && options.reporterOptions) {
    if (options.reporterOptions.output) {
      if (!fs.createWriteStream) {
        throw new Error('file output not supported in browser');
      }

      mkdirp.sync(path.dirname(options.reporterOptions.output));
      self.fileStream = fs.createWriteStream(options.reporterOptions.output);
    }

    // get the suite name from the reporter options (if provided)
    suiteName = options.reporterOptions.suiteName;
  }

  // fall back to the default suite name
  suiteName = suiteName || DEFAULT_SUITE_NAME;

  runner.on('pending', function(test) {
    tests.push(test);
  });

  runner.on('pass', function(test) {
    tests.push(test);
  });

  runner.on('fail', function(test) {
    tests.push(test);
  });

  runner.once('end', function() {
    self.write(
      tag(
        'testsuite',
        {
          name: suiteName,
          tests: stats.tests,
          failures: stats.failures,
          errors: stats.failures,
          skipped: stats.tests - stats.failures - stats.passes,
          timestamp: new Date().toUTCString(),
          time: stats.duration / 1000 || 0
        },
        false
      )
    );

    tests.forEach(function(t) {
      self.test(t);
    });

    self.write('</testsuite>');
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(XUnit, Base);

/**
 * Override done to close the stream (if it's a file).
 *
 * @param failures
 * @param {Function} fn
 */
XUnit.prototype.done = function(failures, fn) {
  if (this.fileStream) {
    this.fileStream.end(function() {
      fn(failures);
    });
  } else {
    fn(failures);
  }
};

/**
 * Write out the given line.
 *
 * @param {string} line
 */
XUnit.prototype.write = function(line) {
  if (this.fileStream) {
    this.fileStream.write(line + '\n');
  } else if (typeof process === 'object' && process.stdout) {
    process.stdout.write(line + '\n');
  } else {
    console.log(line);
  }
};

/**
 * Output tag for the given `test.`
 *
 * @param {Test} test
 */
XUnit.prototype.test = function(test) {
  const attrs = {
    classname: test.parent.fullTitle(),
    name: test.title,
    time: test.duration / 1000 || 0
  };

  if (test.state === 'failed') {
    const err = test.err;
    this.write(
      tag(
        'testcase',
        attrs,
        false,
        tag(
          'failure',
          {},
          false,
          escape(err.message) + '\n' + escape(err.stack)
        )
      )
    );
  } else if (test.isPending()) {
    this.write(tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    this.write(tag('testcase', attrs, true));
  }
};

/**
 * HTML tag helper.
 *
 * @param name
 * @param attrs
 * @param close
 * @param content
 * @return {string}
 */
function tag(name, attrs, close, content) {
  const end = close ? '/>' : '>';
  const pairs = [];
  let tag;

  for (const key in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, key)) {
      pairs.push(key + '="' + escape(attrs[key]) + '"');
    }
  }

  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
  if (content) {
    tag += content + '</' + name + end;
  }
  return tag;
}
