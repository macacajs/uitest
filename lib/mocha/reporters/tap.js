'use strict';
/**
 * @module TAP
 */
/**
 * Module dependencies.
 */

const Base = require('./base');

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Initialize a new `TAP` reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @augments Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function TAP(runner) {
  Base.call(this, runner);

  let n = 1;
  let passes = 0;
  let failures = 0;

  runner.on('start', function() {
    const total = runner.grepTotal(runner.suite);
    console.log('%d..%d', 1, total);
  });

  runner.on('test end', function() {
    ++n;
  });

  runner.on('pending', function(test) {
    console.log('ok %d %s # SKIP -', n, title(test));
  });

  runner.on('pass', function(test) {
    passes++;
    console.log('ok %d %s', n, title(test));
  });

  runner.on('fail', function(test, err) {
    failures++;
    console.log('not ok %d %s', n, title(test));
    if (err.stack) {
      console.log(err.stack.replace(/^/gm, '  '));
    }
  });

  runner.once('end', function() {
    console.log('# tests ' + (passes + failures));
    console.log('# pass ' + passes);
    console.log('# fail ' + failures);
  });
}

/**
 * Return a TAP-safe title of `test`
 *
 * @api private
 * @param {Object} test
 * @return {String}
 */
function title(test) {
  return test.fullTitle().replace(/#/g, '');
}
