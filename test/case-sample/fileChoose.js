describe('test/case-sample/fileChoose.js', () => {
  afterEach(() => {
    document.querySelector('#testForKeyboard').innerHTML = '';
  });

  it('file choose should be ok', async () => {
    if (!_macaca_uitest.fileChooser) return;
    document.querySelector('#testForKeyboard').innerHTML = '<input id="input" type="file"/>';
    const inputDOM = document.querySelector('#input');
    assert(inputDOM);
    const rect = inputDOM.getBoundingClientRect();
    await Promise.all([
      _macaca_uitest.fileChooser('README.md'),
      _macaca_uitest.mouse.click(rect.left + 1, rect.top + 1),
    ]);

    assert.strictEqual(inputDOM.files[0].name, 'README.md');
  });
});
