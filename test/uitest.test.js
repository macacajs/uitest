/* ================================================================
 * uitest by xdf(xudafeng[at]126.com)
 *
 * first created at : Sat Aug 13 2016 15:59:46 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright  xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const uitest = require('..');
const ipv4 = require('ipv4');

describe('test', function() {
  this.timeout(300 * 1000);
  it('test', function *() {
    const port = 8081;
    yield uitest({
      url: `http://${ipv4}:${port}/test/`,
      width: 400,
      height: 300
    });
  });
});
