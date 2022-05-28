'use strict';

const path = require('path');
const fs = require('fs');

const DataHubSDK = require('datahub-nodejs-sdk');
const datahubClient = new DataHubSDK();

const commands = {
  screenshot: async (driver, path) => {
    return await driver.getScreenshot({path});
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
  exit: async (driver) => {
    await driver.stopDevice();
  },
  saveCoverage: async (_, data) => {
    if (data) {
      const coverageDir = path.join(process.cwd(), 'coverage');
      try {
        fs.mkdirSync(path.join(coverageDir));
        fs.mkdirSync(path.join(coverageDir, '.temp'));
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

module.exports = commands;
