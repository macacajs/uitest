'use strict';
/**
 * @module List
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const inherits = require('../utils').inherits;
const color = Base.color;
const cursor = Base.cursor;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @augments Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function List(runner) {
  Base.call(this, runner);

  const self = this;
  let n = 0;

  runner.on('start', function() {
    console.log();
  });

  runner.on('test', function(test) {
    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
  });

  runner.on('pending', function(test) {
    const fmt = color('checkmark', '  -') + color('pending', ' %s');
    console.log(fmt, test.fullTitle());
  });

  runner.on('pass', function(test) {
    const fmt =
      color('checkmark', '  ' + Base.symbols.ok) +
      color('pass', ' %s: ') +
      color(test.speed, '%dms');
    cursor.CR();
    console.log(fmt, test.fullTitle(), test.duration);
  });

  runner.on('fail', function(test) {
    cursor.CR();
    console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());
  });

  runner.once('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(List, Base);
