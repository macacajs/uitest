'use strict';

const Playwright = require('macaca-playwright');

const setupCommands = require('../playwright-commands');

module.exports = async options => {
  const playwright = new Playwright();
  const opts = Object.assign({
    debug: true,
    redirectConsole: true
  }, options);
  console.log(JSON.stringify(opts, null, 2));

  await playwright.startDevice(opts);
  await setupCommands(playwright);
  await playwright.get(options.url);

  return await playwright.browserContext.waitForEvent('close', { timeout: 0 });
};
