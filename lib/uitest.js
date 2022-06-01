'use strict';

module.exports = async options => {
  return await require('./playwright')(options);
};
