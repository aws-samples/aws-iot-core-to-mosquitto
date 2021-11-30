"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubscriptionAndConnectToTopic = createSubscriptionAndConnectToTopic;

var _mosquitto = require("./mosquitto");

var _iotv = require("../services/iotv2");

var _env = require("../env");

var _winstonLogger = _interopRequireDefault(require("../utils/winstonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
const decoder = new TextDecoder("utf8"); // TO-DO Valdiate the mock callback

/* istanbul ignore next */

async function sendToDeneva(topic, payload) {
  const decodePayload = decoder.decode(payload).replace(/\r?\n|\r/g, "");

  _winstonLogger.default.info(`Payload from Cloud: ${decodePayload}`);

  const payloadObject = JSON.parse(decodePayload);
  const targetTopic = JSON.stringify(payloadObject.destinationTopic); //   const campaignsList = JSON.stringify(payloadObject.campaignsSortedList);

  const campaignsList = payloadObject.campaignsSortedList;
  await (0, _mosquitto.publish)(targetTopic, JSON.stringify(campaignsList));
} // eslint-disable-next-line import/prefer-default-export


async function createSubscriptionAndConnectToTopic(topic) {
  try {
    const iotConnection = (0, _iotv.createConnectionConfigs)(_env.mqttBrokerInfo.mqttClientId);

    if (iotConnection) {
      await (0, _iotv.createSubscribeOnConnectAndResume)(iotConnection, topic, sendToDeneva);
      await iotConnection.connect();
    } else {
      // Resilience in error threating

      /* istanbul ignore next */
      throw new Error("No IoT Connection Created. Retrying...");
    }
  } catch (error) {
    _winstonLogger.default.error(`Unable to subscribe to Topic. Error: ${error.message}.`);
  }
}
//# sourceMappingURL=listenToTopic.js.map