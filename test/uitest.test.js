'use strict';

const path = require('path');
const uitest = require('..');
const detect = require('detect-port');

describe('test/uietst.test.js', () => {
  it('run test should be ok', async () => {
    const url = path.join(__dirname, 'index.html');
    await uitest({
      url: `file://${url}`,
      width: 800,
      height: 600
    });
  });
});
