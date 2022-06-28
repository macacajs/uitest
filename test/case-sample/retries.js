describe('test/case-sample/sample2.js', () => {
  const collections = [];

  beforeEach(async () => {
    collections.push(1);
  });

  it.retries(3, 'retries should be work', async () => {
    if (collections.length !== 2) throw new Error('error');
  });
});
