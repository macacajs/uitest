describe('test/case-sample/page.js', () => {
  it('page should be ok', async () => {
    if (!_macaca_uitest.page) return;
    const { page } = _macaca_uitest;
    const pageId = await page.newPage('https://google.com');
    let title = await page.exec(pageId, async () => document.title);
    assert.equal(title, 'Google');
    await page.exec(pageId, async () => {
      await _macaca_uitest.keyboard.insertText('😂');
      await _macaca_uitest.keyboard.press('Enter');
      return false;
    });
    await page.waitForEvent(pageId, 'load');
    title = await page.exec(pageId, async () => document.title);
    assert.equal(title, '😂 - Google 搜索');
    await page.close(pageId);
  });
});
