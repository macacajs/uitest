'use strict';

const Suite = require('../suite');

/**
 * Functions common to more than one interface.
 *
 * @param {Suite[]} suites
 * @param {Context} context
 * @return {Object} An object containing common functions.
 */
module.exports = function(suites, context) {
  return {
    /**
     * This is only present if flag --delay is passed into Mocha. It triggers
     * root suite execution.
     *
     * @param {Suite} suite The root suite.
     * @return {Function} A function which runs the root suite
     */
    runWithSuite: function runWithSuite(suite) {
      return function run() {
        suite.run();
      };
    },

    /**
     * Execute before running tests.
     *
     * @param {string} name
     * @param {Function} fn
     */
    before(name, fn) {
      suites[0].beforeAll(name, fn);
    },

    /**
     * Execute after running tests.
     *
     * @param {string} name
     * @param {Function} fn
     */
    after(name, fn) {
      suites[0].afterAll(name, fn);
    },

    /**
     * Execute before each test case.
     *
     * @param {string} name
     * @param {Function} fn
     */
    beforeEach(name, fn) {
      suites[0].beforeEach(name, fn);
    },

    /**
     * Execute after each test case.
     *
     * @param {string} name
     * @param {Function} fn
     */
    afterEach(name, fn) {
      suites[0].afterEach(name, fn);
    },

    suite: {
      /**
       * Create an exclusive Suite; convenience function
       * See docstring for create() below.
       *
       * @param {Object} opts
       * @return {Suite}
       */
      only: function only(opts) {
        opts.isOnly = true;
        return this.create(opts);
      },

      /**
       * Create a Suite, but skip it; convenience function
       * See docstring for create() below.
       *
       * @param {Object} opts
       * @return {Suite}
       */
      skip: function skip(opts) {
        opts.pending = true;
        return this.create(opts);
      },

      /**
       * Creates a suite.
       * @param {Object} opts Options
       * @param {string} opts.title Title of Suite
       * @param {Function} [opts.fn] Suite Function (not always applicable)
       * @param {boolean} [opts.pending] Is Suite pending?
       * @param {string} [opts.file] Filepath where this Suite resides
       * @param {boolean} [opts.isOnly] Is Suite exclusive?
       * @return {Suite}
       */
      create: function create(opts) {
        const suite = Suite.create(suites[0], opts.title);
        suite.pending = Boolean(opts.pending);
        suite.file = opts.file;
        suites.unshift(suite);
        if (opts.isOnly) {
          suite.parent._onlySuites = suite.parent._onlySuites.concat(suite);
        }
        if (typeof opts.fn === 'function') {
          opts.fn.call(suite);
          suites.shift();
        } else if (typeof opts.fn === 'undefined' && !suite.pending) {
          throw new Error(
            'Suite "' +
              suite.fullTitle() +
              '" was defined but no callback was supplied. Supply a callback or explicitly skip the suite.'
          );
        } else if (!opts.fn && suite.pending) {
          suites.shift();
        }

        return suite;
      }
    },

    test: {
      /**
       * Exclusive test-case.
       *
       * @param {Object} mocha
       * @param {Function} test
       * @return {*}
       */
      only(mocha, test) {
        test.parent._onlyTests = test.parent._onlyTests.concat(test);
        return test;
      },

      /**
       * Pending test case.
       *
       * @param {string} title
       */
      skip(title) {
        context.test(title);
      },

      /**
       * Number of retry attempts
       *
       * @param {number} n
       */
      retries(n) {
        context.retries(n);
      }
    }
  };
};
