'use strict';

describe('test/case-sample/sample1.js', function() {
  this.timeout(30 * 1000);

  it('1should be true', function(done) {
    _macaca_uitest.screenshot('aa.png', function() {
      console.log('1diff')
      //throw Error();
      done();
    });
  });

  it('2should be true', function(done) {
    _macaca_uitest.screenshot('aa1.png', function() {
      console.log('2diff')
      done();
    });
  });

  it('3should be true', function(done) {
    _macaca_uitest.screenshot('aa123.png', function() {
      console.log('3diff')
      done();
    });
  });
});

