'use strict';

/**
 * return a thenable function can be use for await and function to call
 * use
 * ```js
 * // demo
 * const fn = createThenableFunction();
 * setTimeout(fn, 1000, 1);
 * const ret = await fn; // ret === 1
 * ```
 * @return {{
 *  (..args: any[]) => void;
 *  then: cb => void;
 * }} thenable function
 */
function createThenableFunction() {
  let recordCallback;
  let resultCache;

  const fn = (...args) => {
    resultCache = args;
    if (recordCallback) {
      recordCallback(...args);
    }
  };

  fn.then = callback => {
    if (resultCache) {
      callback(...resultCache);
    } else {
      recordCallback = callback;
    }
  };
  
  return fn;
}

module.exports = {
  createThenableFunction,
};
