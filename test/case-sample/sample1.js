'use strict';

describe('test/case-sample/sample1.js', () => {

  it('1should be true', done => {
    _macaca_uitest.screenshot('aa.png', () => {
      console.log('1diff')
      //throw Error();
      done();
    });
  });

  it('2should be true', done => {
    _macaca_uitest.screenshot('aa1.png', () => {
      console.log('2diff')
      done();
    });
  });

  it('3should be true', done => {
    _macaca_uitest.screenshot('aa123.png', () => {
      console.log('3diff')
      done();
    });
  });
});

