'use strict';

describe('test/case-sample/mouse.js', () => {

  afterEach(()=>{
    document.querySelector('#testForMouse').innerHTML = '';
  });

  it('mouse should be ok', async () => {
    if (!_macaca_uitest.mouse) return;
    document.querySelector('#testForMouse').innerHTML = '<button id="btn">btn</button>';
    const btn = document.querySelector('#btn');
    assert(btn);
    let result = '';
    btn.onmousemove = () => {
      result += '1';
    };
    btn.onmousedown = () => {
      result += '2';
    };
    btn.onmouseup = () => {
      result += '3';
    };
    btn.onclick = () => {
      result += '4';
    };
    btn.ondblclick = () => {
      result += '5';
    };
    // 1234123412342345
    const { x, y } = btn.getBoundingClientRect();
    await _macaca_uitest.mouse.move(x + 1, y + 1);
    await _macaca_uitest.mouse.down();
    await _macaca_uitest.mouse.up();  // 连续触发鼠标down和up 会触发click
    result+= ',';
    await _macaca_uitest.mouse.click(x + 1, y + 1); // 触发mousemove mousedown mouseup click
    result+= ',';
    await _macaca_uitest.mouse.dblclick(x + 2, y + 2); // 触发mousemove mousedown mouseup click mousedown mouseup dblclick
    assert.equal(result, '1234,1234,12342345');
  });
});

