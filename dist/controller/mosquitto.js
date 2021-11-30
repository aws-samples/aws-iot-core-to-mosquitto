"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publish = publish;

var _env = require("../env");

var _mosquitto = require("../services/mosquitto");

var _winstonLogger = _interopRequireDefault(require("../utils/winstonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/prefer-default-export
async function publish(topic, payload) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const mosquittoClient = await (0, _mosquitto.getMQTTClient)(_env.mosquittoURI);
      const cleanTopic = topic.replace(/['"]+/g, "");

      _winstonLogger.default.info(`Sending message on topic: ${cleanTopic}`); // await mosquittoClient.asyncDevice.subscribe(cleanTopic);


      const publishMessage = await mosquittoClient.asyncDevice.publish(cleanTopic, payload); // await mosquittoClient.asyncDevice.unsubscribe(cleanTopic);

      _winstonLogger.default.info("Message Sent to Mosquitto Topic");

      resolve(publishMessage);
    } catch (error) {
      reject(new Error(`Not able to publish data to Mosquitto. Error: ${error}`));
    }
  });
}
//# sourceMappingURL=mosquitto.js.map