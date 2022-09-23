'use strict';

const path = require('path');
const uitest = require('..');

describe('test/uitest.test.js', function() {
  this.timeout(60 * 1000);
  it('run test should be ok', async () => {
    const url = path.join(__dirname, 'index.html');
    await uitest({
      url: `file://${url}`,
      width: 800,
      height: 600,
    });
  });
});

