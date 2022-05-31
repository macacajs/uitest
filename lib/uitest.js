'use strict';

module.exports = async options => {
  return await require('./driver/playwright')(options);
};
