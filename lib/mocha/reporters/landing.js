/* eslint-disable no-bitwise */
'use strict';
/**
 * @module Landing
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const inherits = require('../utils').inherits;
const cursor = Base.cursor;
const color = Base.color;

/**
 * Expose `Landing`.
 */

exports = module.exports = Landing;

/**
 * Airplane color.
 */

Base.colors.plane = 0;

/**
 * Airplane crash color.
 */

Base.colors['plane crash'] = 31;

/**
 * Runway color.
 */

Base.colors.runway = 90;

/**
 * Initialize a new `Landing` reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @augments Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function Landing(runner) {
  Base.call(this, runner);

  const self = this;
  const width = (Base.window.width * 0.75) | 0;
  const total = runner.total;
  const stream = process.stdout;
  let plane = color('plane', '✈');
  let crashed = -1;
  let n = 0;

  function runway() {
    const buf = Array(width).join('-');
    return '  ' + color('runway', buf);
  }

  runner.on('start', function() {
    stream.write('\n\n\n  ');
    cursor.hide();
  });

  runner.on('test end', function(test) {
    // check if the plane crashed
    const col = crashed === -1 ? (width * ++n / total) | 0 : crashed;

    // show the crash
    if (test.state === 'failed') {
      plane = color('plane crash', '✈');
      crashed = col;
    }

    // render landing strip
    stream.write('\u001b[' + (width + 1) + 'D\u001b[2A');
    stream.write(runway());
    stream.write('\n  ');
    stream.write(color('runway', Array(col).join('⋅')));
    stream.write(plane);
    stream.write(color('runway', Array(width - col).join('⋅') + '\n'));
    stream.write(runway());
    stream.write('\u001b[0m');
  });

  runner.once('end', function() {
    cursor.show();
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Landing, Base);
