'use strict';

module.exports = async options => {
  if (process.env.MACACA_UITEST_PLAYWRIGHT) {
    return await require('./driver/playwright')(options);
  }
  return await require('./driver/electron')(options);
};
