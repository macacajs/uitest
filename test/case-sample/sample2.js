'use strict';

const { assert } = chai;

describe('test/case-sample/sample2.js', function() {
  this.timeout(30 * 1000);

  before(async () => {
    const p = new Promise((resolve, reject) => {
      resolve('res');
    });
    const res = await p;
    console.log('before', res);
  });

  beforeEach(() => {
    console.log('beforeEach');
  });

  after(() => {
    console.log('after');
  });

  it('should be ok', async () => {
    const p = new Promise((resolve, reject) => {
      resolve('res');
    });
    const res = await p;
    assert.equal(res, 'res');
  });
});

