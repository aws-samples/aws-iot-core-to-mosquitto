"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMQTTClient = getMQTTClient;

var _mqtt = _interopRequireDefault(require("mqtt"));

var _asyncMqtt = _interopRequireDefault(require("async-mqtt"));

var _winstonLogger = _interopRequireDefault(require("../utils/winstonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
const {
  AsyncClient
} = _asyncMqtt.default;
let mqtt;
/**
 * Get MQTT Mosquitto Client
 * @param {object} options
 * */
// eslint-disable-next-line import/prefer-default-export

async function getMQTTClient(mosquittoURI) {
  if (mqtt) {
    return mqtt;
  }

  return new Promise((resolve, reject) => {
    _winstonLogger.default.info(`Mosquitto Broker: ${mosquittoURI}`);

    const device = _mqtt.default.connect(mosquittoURI);

    const asyncDevice = new AsyncClient(device);
    asyncDevice.on("message", (t, msg) => {
      _winstonLogger.default.info(`Got a message on "${t}"...`);

      _winstonLogger.default.info(msg.toString());
    });
    asyncDevice.on("connect", () => {
      _winstonLogger.default.debug("Connected to MQTT Mosquitto broker...");

      mqtt = {
        device,
        asyncDevice
      };
      resolve(mqtt);
    });
    asyncDevice.on("error", err => {
      _winstonLogger.default.error(`Error when connecting to Mosquitto broker: ${err.message}`); // reconnectInMs(asyncDevice, 2000);


      reject(err);
    });
  });
}
//# sourceMappingURL=mosquitto.js.map