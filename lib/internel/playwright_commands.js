'use strict';

const path = require('path');
const fs = require('fs');

const DataHubSDK = require('datahub-nodejs-sdk');
const datahubClient = new DataHubSDK();

const commands = {
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
  screenshot: async (context, path) => {
    return await context.getScreenshot({path});
  },
  switchScene: async (_, argData) => {
    try {
      await datahubClient.switchScene(argData);
    } catch (e) {
      return false;
    }
    return true;
  },
  switchAllScenes: async (_, argData) => {
    try {
      await datahubClient.switchAllScenes(argData);
    } catch (e) {
      return false;
    }
    return true;
  },
  exit: async (context, failData) => {
    await context.stopDevice();
    if (failData.failedCount > 0) {
      process.exit(1);
    }
  },
  saveCoverage: async (_, data) => {
    if (data) {
      const coverageDir = path.join(process.cwd(), 'coverage');
      try {
        if (!fs.existsSync(path.join(coverageDir))) {
          fs.mkdirSync(path.join(coverageDir));
        }
        if (!fs.existsSync(path.join(coverageDir, '.temp'))) {
          fs.mkdirSync(path.join(coverageDir, '.temp'));
        }
      } catch (e) {
        return false;
      }
      const file = path.join(coverageDir, '.temp', `${+new Date()}_coverage.json`);
      // ignore tests
      const coverageIgnore = process.env.MACACA_COVERAGE_IGNORE_REG;
      if (coverageIgnore) {
        const ignoreReg = new RegExp(coverageIgnore, 'i');
        for (const k in data) {
          if (ignoreReg.test(k)) {
            delete data[k];
          }
        }
      }
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      console.log(`coverage file created at: ${file}`);
    }
    return true;
  }
};

async function setupCommands(context) {
  const { browserContext } = context;

  await browserContext.exposeFunction('__execCommand', async (name, ...args) => {
    if (typeof name !== 'string') throw new Error(`invalid command name ${name}`);
    if (!commands[name]) throw new Error(`unknown command name ${name}`);
    return await commands[name](context, ...args);
  });
};

module.exports = setupCommands;
