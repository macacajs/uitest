'use strict';

const Test = require('../test');

/**
 * QUnit-style interface:
 *
 *     suite('Array');
 *
 *     test('#length', function() {
 *       var arr = [1,2,3];
 *       ok(arr.length == 3);
 *     });
 *
 *     test('#indexOf()', function() {
 *       var arr = [1,2,3];
 *       ok(arr.indexOf(1) == 0);
 *       ok(arr.indexOf(2) == 1);
 *       ok(arr.indexOf(3) == 2);
 *     });
 *
 *     suite('String');
 *
 *     test('#length', function() {
 *       ok('foo'.length == 3);
 *     });
 *
 * @param {Suite} suite Root suite.
 */
module.exports = function qUnitInterface(suite) {
  const suites = [suite];

  suite.on('pre-require', function(context, file, mocha) {
    const common = require('./common')(suites, context, mocha);

    context.before = common.before;
    context.after = common.after;
    context.beforeEach = common.beforeEach;
    context.afterEach = common.afterEach;
    context.run = mocha.options.delay && common.runWithSuite(suite);
    /**
     * Describe a "suite" with the given `title`.
     */

    context.suite = function(title) {
      if (suites.length > 1) {
        suites.shift();
      }
      return common.suite.create({
        title,
        file,
        fn: false
      });
    };

    /**
     * Exclusive Suite.
     */

    context.suite.only = function(title) {
      if (suites.length > 1) {
        suites.shift();
      }
      return common.suite.only({
        title,
        file,
        fn: false
      });
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.test = function(title, fn) {
      const test = new Test(title, fn);
      test.file = file;
      suites[0].addTest(test);
      return test;
    };

    /**
     * Exclusive test-case.
     */

    context.test.only = function(title, fn) {
      return common.test.only(mocha, context.test(title, fn));
    };

    context.test.skip = common.test.skip;
    context.test.retries = common.test.retries;
  });
};
