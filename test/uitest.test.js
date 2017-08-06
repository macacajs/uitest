'use strict';

const uitest = require('..');
const ipv4 = require('ipv4');
const detect = require('detect-port');

describe('test', function() {
  this.timeout(300 * 1000);
  it('test', function *() {
    const port = yield detect(8081);
    yield uitest({
      url: `http://${ipv4}:${port}/test/`,
      width: 400,
      height: 300
    });
  });
});
