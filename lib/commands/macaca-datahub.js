'use strict';

const DataHubSDK = require('datahub-nodejs-sdk');

const datahubClient = new DataHubSDK();

module.exports = {
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
  }
};
