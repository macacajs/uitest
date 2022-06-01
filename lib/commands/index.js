'use strict';

const fs = require('fs');
const path = require('path');

const { createThenableFunction } = require('../utils');
const browserEvents = require('./browser-events');
const macacaDatahubCommands = require('./macaca-datahub');

const exitForWait = createThenableFunction();

const commands = Object.assign({},
  macacaDatahubCommands,
  browserEvents,
  {
    screenshot: async (context, dir) => {
      return await context.getScreenshot(context, { dir });
    },
    exit: async (context, failData) => {
      await context.stopDevice();
      exitForWait(failData.failedCount || 0);
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
    },
    saveReport: async (_, output) => {
      try {
        const reportsDir = path.join(process.cwd(), 'reports');

        if (!(fs.existsSync(reportsDir) && fs.statSync(reportsDir).isDirectory())) {
          fs.mkdirSync(reportsDir);
        }

        const reportsFile = path.join(reportsDir, 'json-final.json');
        fs.writeFileSync(reportsFile, JSON.stringify(output, null, 2), 'utf8');
        console.log(`reports file created at: ${reportsFile}`);
      } catch (e) {
        console.error(e);
      }
    }
  }
);

async function setupCommands(context) {
  const { browserContext } = context;

  await browserContext.exposeFunction('__execCommand', async (name, ...args) => {
    if (typeof name !== 'string') throw new Error(`invalid command name ${name}`);
    if (!commands[name]) throw new Error(`unknown command name ${name}`);
    return await commands[name](context, ...args);
  });
};

module.exports = {
  setupCommands,
  exitForWait,
};
