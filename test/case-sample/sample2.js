const { assert } = chai;

describe('test/case-sample/sample2.js', () => {
  before(async () => {
    const p = new Promise((resolve, reject) => {
      resolve('res');
    });
    const res = await p;
    console.log('before', res);
  });

  beforeEach(async () => {
    const p = new Promise((resolve, reject) => {
      resolve('res');
    });
    const res = await p;
    console.log('beforeEach', res);
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
