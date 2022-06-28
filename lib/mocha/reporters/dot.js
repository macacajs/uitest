/* eslint-disable no-bitwise */
'use strict';
/**
 * @module Dot
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const inherits = require('../utils').inherits;
const color = Base.color;

/**
 * Expose `Dot`.
 */

exports = module.exports = Dot;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @class
 * @memberof Mocha.reporters
 * @augments Mocha.reporters.Base
 * @public
 * @api public
 * @param {Runner} runner
 */
function Dot(runner) {
  Base.call(this, runner);

  const self = this;
  const width = (Base.window.width * 0.75) | 0;
  let n = -1;

  runner.on('start', function() {
    process.stdout.write('\n');
  });

  runner.on('pending', function() {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    process.stdout.write(color('pending', Base.symbols.comma));
  });

  runner.on('pass', function(test) {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    if (test.speed === 'slow') {
      process.stdout.write(color('bright yellow', Base.symbols.dot));
    } else {
      process.stdout.write(color(test.speed, Base.symbols.dot));
    }
  });

  runner.on('fail', function() {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    process.stdout.write(color('fail', Base.symbols.bang));
  });

  runner.once('end', function() {
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Dot, Base);
