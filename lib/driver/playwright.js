'use strict';

const Playwright = require('macaca-playwright');

const commands = require('../internel/playwright_commands');

module.exports = async options => {
  const playwright = new Playwright();
  const opts = Object.assign({
    headless: false,
    debug: true,
    uitest: true
  }, options);
  console.log(JSON.stringify(opts, null, 2));

  playwright.registerCommands(commands);

  await playwright.startDevice(opts);
  await playwright.get(options.url);

  return await playwright.waitForClose();
};
