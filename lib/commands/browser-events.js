'use strict';

module.exports = {
  keyboard: async (context, type, key, opt) => {
    const { page } = context;
    if (page.keyboard[type]) {
      await page.keyboard[type](key, opt);
    }
    return true;
  },
  mouse: async (context, type, x, y, opt) => {
    const { page } = context;
    if (page.mouse[type]) {
      await page.mouse[type](x, y, opt);
    }
    return true;
  },
  fileChooser: async (context, filePath) => {
    const { page } = context;
    const fileChooser = await page.waitForEvent('filechooser');
    await fileChooser.setFiles(filePath);
    return true;
  },
};
