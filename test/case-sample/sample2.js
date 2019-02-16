'use strict';

const { assert } = chai;

describe('test/case-sample/sample2.js', function() {
  this.timeout(30 * 1000);

  it('should be ok', async () => {
    const p = new Promise((resolve, reject) => {
      resolve('res');
    });
    const res = await p;
    assert.equal(res, 'res');
  });
});

