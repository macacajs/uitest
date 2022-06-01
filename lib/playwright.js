'use strict';

const Playwright = require('macaca-playwright');

const { setupCommands, exitForWait } = require('./commands');

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

  const failCount = await exitForWait;
  
  if (failCount > 0) {
    throw new Error('test failed');
  }
  return true;
};
