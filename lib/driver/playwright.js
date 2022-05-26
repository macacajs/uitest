'use strict';

const Playwright = require('macaca-playwright');

module.exports = async options => {
  const playwright = new Playwright();
  const opts = Object.assign({
    headless: false,
    debug: true,
    uitest: true
  }, options);
  console.log(JSON.stringify(opts, null, 2));
  await playwright.startDevice(opts);
  await playwright.get(options.url);

  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 5e3);
  });
};
