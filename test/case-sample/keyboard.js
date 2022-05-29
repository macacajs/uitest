'use strict';

describe('test/case-sample/keyboard.js', () => {

  afterEach(()=>{
    document.querySelector('#testForKeyboard').innerHTML = '';
  });

  it('keyboard insertText should be ok', async ()=>{
    if (!_macaca_uitest.keyboard) return;
    document.querySelector('#testForKeyboard').innerHTML = '<input id="input"/>';
    const inputDOM = document.querySelector('#input');
    assert(inputDOM);
    inputDOM.focus();
    await _macaca_uitest.keyboard.insertText('😂');
    assert.equal('😂', inputDOM.value);
  });

  it('keyboard should be ok', async ()=>{
    if (!_macaca_uitest.keyboard) return;
    document.querySelector('#testForKeyboard').innerHTML = '<input id="input"/>';
    const inputDOM = document.querySelector('#input');
    assert(inputDOM);
    inputDOM.focus();
    await _macaca_uitest.keyboard.type('Hello World!');
    await _macaca_uitest.keyboard.press('ArrowLeft');

    await _macaca_uitest.keyboard.down('Shift');
    for (let i = 0; i < ' World'.length; i++) {await _macaca_uitest.keyboard.press('ArrowLeft');}
    await _macaca_uitest.keyboard.up('Shift');

    await _macaca_uitest.keyboard.press('Backspace');
    assert.equal('Hello!', inputDOM.value);
  });
});

