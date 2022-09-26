'use strict';
const fs = require('fs');

const shimContent = fs.readFileSync(__dirname + '/../../uitest-mocha-shim.js').toString();
const pages = [];

module.exports = {
  newPage: async ({ context }, url) => {
    const { browserContext } = context;
    const page = await browserContext.newPage();
    await page.goto(url, {
      waitUntil: 'load' || 'networkidle',
    });
    await page.addScriptTag({
      content: shimContent,
    });
    const redirectConsole = require('macaca-playwright/dist/lib/redirect-console');
    await redirectConsole({ page });
    return pages.push(page) - 1;
  },
  closePage: async (_, id) => {
    const page = pages[id];
    if (page) {
      page.close({ runBeforeUnload: true });
      pages[id] = null;
    }
    return false;
  },
  runInPage: async (_, id, funcString) => {
    const page = pages[id];
    if (page) {
      return await page.evaluate(funcString);
    }
    return false;
  },
  waitForSelector: async (_, id, selector) => {
    const page = pages[id];
    if (page) {
      return await page.waitForSelector(selector);
    }
    return false;
  },
  waitForEvent: async (_, id, eventName) => {
    const page = pages[id];
    if (page) {
      return await new Promise(resolve => {
        const loaded = () => {
          page.removeListener(eventName, loaded);
          resolve(true);
        };
        page.on(eventName, loaded);
      });
    }
    return false;
  },
};
