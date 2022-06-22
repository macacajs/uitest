'use strict';
/**
 * @module Min
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const inherits = require('../utils').inherits;

/**
 * Expose `Min`.
 */

exports = module.exports = Min;

/**
 * Initialize a new `Min` minimal test reporter (best used with --watch).
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @augments Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function Min(runner) {
  Base.call(this, runner);

  runner.on('start', function() {
    // clear screen
    process.stdout.write('\u001b[2J');
    // set cursor position
    process.stdout.write('\u001b[1;3H');
  });

  runner.once('end', this.epilogue.bind(this));
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Min, Base);
