'use strict';

const { createThenableFunction } = require('../lib/utils');

describe('test/exit.test.js', () => {
  it('createThenableFunction should be ok', async () => {
    const randomRet = Math.random();
    const fn = createThenableFunction();
    
    setTimeout(()=>{
      fn(randomRet);
    }, 10);
    
    const ret = await fn;

    if(ret !== randomRet) {
      throw new Error('failed');
    }
  });
});
