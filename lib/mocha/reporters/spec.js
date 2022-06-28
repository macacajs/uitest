/* eslint-disable */
'use strict';
/**
 * @module Spec
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const inherits = require('../utils').inherits;
const color = Base.color;

/**
* Expose `Spec`.
*/

exports = module.exports = Spec;

/**
 * support macaca-reporter
 */
function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  const stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function (key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function (key, value) {
    if (stack.length > 0) {
      const thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}

const totalTests = {
  total: 0
};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function transferCode(data) {
  data = data
    .replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
    .replace(/^\uFEFF/, '')
    .replace(/^function\s*\(.*\)\s*{|\(.*\)\s*=>\s*{?/, '')
    .replace(/\s*\}$/, '')
    .replace(/&quot;/g, '');

  const spaces = data.match(/^\n?( *)/)[1].length;
  const tabs = data.match(/^\n?(\t*)/)[1].length;
  const reg = new RegExp(`^\n?${tabs ? '\t' : ' '}{${tabs || spaces}}`, 'gm');

  return data
    .replace(reg, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\)\./g, '\)\n\.');
}

function transferTest(test, suite, parentTitle) {
  const code = test.fn ? test.fn.toString() : test.body;

  const cleaned = {
    title: test.title,
    fullTitle: parentTitle + ' -- ' + suite.title + ' -- ' + test.title,
    duration: test.duration || 0,
    state: test.state,
    pass: test.state === 'passed',
    fail: test.state === 'failed',
    pending: test.pending,
    context: require('../utils').stringify(test.context),
    code: code && transferCode(code),
    uuid: test.uuid || uuid()
  };

  cleaned.skipped = !cleaned.pass && !cleaned.fail && !cleaned.pending && !cleaned.isHook;
  return cleaned;
}

function transferSuite(suite, totalTests, totalTime, parentTitle) {
  suite.uuid = uuid();
  const cleanTmpTests = suite.tests.map(test => test.state && transferTest(test, suite, parentTitle));
  const cleanTests = cleanTmpTests.filter(test => !!test);

  const passingTests = cleanTests.filter(item => item.state === 'passed');

  const failingTests = cleanTests.filter(item => item.state === 'failed');
  const pendingTests = cleanTests.filter(item => item.pending);
  const skippedTests = cleanTests.filter(item => item.skipped);
  let duration = 0;

  cleanTests.forEach(test => {
    duration += test.duration;
    totalTime.time += test.duration;
  });

  suite.tests = cleanTests;
  suite.fullFile = suite.file || '';
  suite.file = suite.file ? suite.file.replace(process.cwd(), '') : '';
  suite.passes = passingTests;
  suite.failures = failingTests;
  suite.pending = pendingTests;
  suite.skipped = skippedTests;
  suite.totalTests = suite.tests.length;
  suite.totalPasses = passingTests.length;
  suite.totalFailures = failingTests.length;
  suite.totalPending = pendingTests.length;
  suite.totalSkipped = skippedTests.length;
  suite.duration = duration;
}

function getSuite(suite, totalTests) {
  const totalTime = {
    time: 0
  };
  const queue = [];
  const result = JSON.parse(suite.replace(/&quot;/g, ''));
  let next = result;
  totalTests.total++;
  while (next) {

    if (next.root) {
      transferSuite(next, totalTests, totalTime);
    }

    if (next.suites && next.suites.length) {
      next.suites.forEach(nextSuite => {
        transferSuite(nextSuite, totalTests, totalTime, next.title);
        queue.push(nextSuite);
      });
    }
    next = queue.shift();
  }
  result._totalTime = totalTime.time;
  return stringify(result);
}

function done(output, config, failures, exit) {
  try {
    window.__execCommand('saveReport', output)
      .finally(() => exit && exit(failures ? 1 : 0));
  } catch (e) {
    console.log(e);
  }
}

/**
 * Initialize a new `Spec` test reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @augments Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function Spec(runner) {
  Base.call(this, runner);

  const self = this;
  let indents = 0;
  let n = 0;

  function indent() {
    return Array(indents).join('  ');
  }

  const getSuiteData = (isEnd) => {
    const result = getSuite(stringify(this._originSuiteData), totalTests);
    const obj = {
      stats: this.stats,
      suites: JSON.parse(result)
    };

    const {
      passes,
      failures,
      pending,
      tests
    } = obj.stats;

    const passPercentage = Math.round((passes / (totalTests.total - pending)) * 1000) / 10;
    const pendingPercentage = Math.round((pending / totalTests.total) * 1000) / 10;

    if (!isEnd) {
      obj.stats.passPercent = passPercentage;
      obj.stats.pendingPercent = pendingPercentage;
      obj.stats.other = passes + failures + pending - tests;
      obj.stats.hasOther = obj.stats.other > 0;
      obj.stats.skipped = totalTests.total - tests;
      obj.stats.hasSkipped = obj.stats.skipped > 0;
      obj.stats.failures -= obj.stats.other;
    }
    return obj;
  };

  const handleTestEnd = (isEnd) => {
    const obj = getSuiteData(isEnd);
    obj.stats.duration = obj.suites._totalTime || 0;
    this.output = obj;
  };

  this.done = (failures, exit) => done(this.output, this.config, failures, exit);

  runner.on('start', () => {
    this._originSuiteData = runner.suite;
  });

  runner.on('test end', test => {
    test.uuid = uuid();
    handleTestEnd();
  });

  runner.once('end', () => {
    handleTestEnd(true);
    self.epilogue();
  });

  runner.on('suite', function (suite) {
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function () {
    --indents;
    if (indents === 1) {
      console.log();
    }
  });

  runner.on('pending', function (test) {
    test.uuid = uuid();
    const fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function (test) {
    let fmt;
    if (test.speed === 'fast') {
      fmt =
        indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s');
      console.log(fmt, test.title);
    } else {
      fmt =
        indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s') +
        color(test.speed, ' (%dms)');
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function (test, err) {
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
    console.log(indent(), color('fail', require('../utils').escape(err)));
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Spec, Base);
