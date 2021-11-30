"use strict";

var _globals = require("@jest/globals");

var _mqtt = _interopRequireDefault(require("mqtt"));

var _mosquitto = require("../../services/mosquitto");

var _winstonLogger = _interopRequireDefault(require("../../utils/winstonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
_globals.jest.mock("mqtt");

_globals.jest.mock("async-mqtt");

_globals.jest.mock("winston");

_globals.jest.setTimeout(6000);

(0, _globals.describe)("Unit testing for the mosquitto service", () => {
  (0, _globals.it)("Should get the MQTT Client with it's properties", async () => {
    const respEventHandler = await (0, _mosquitto.getMQTTClient)("WHATEVER"); // setTimeout(() => {
    //   self.emit("connect");
    // }, 300);

    (0, _globals.expect)(_mqtt.default.connect).toHaveBeenCalledTimes(1);
    (0, _globals.expect)(respEventHandler).toHaveProperty("device");
    (0, _globals.expect)(respEventHandler).toHaveProperty("asyncDevice");
    (0, _globals.expect)(respEventHandler.device).toHaveProperty("publish");
    (0, _globals.expect)(respEventHandler.device).toHaveProperty("subscribe");
    (0, _globals.expect)(respEventHandler.asyncDevice).toHaveProperty("publish");
    (0, _globals.expect)(respEventHandler.asyncDevice).toHaveProperty("subscribe");
  });
  (0, _globals.it)("Should log an error if an error event occurs", async () => {
    _globals.jest.clearAllMocks();

    const respEventHandler = await (0, _mosquitto.getMQTTClient)("WHATEVER");
    setTimeout(() => {
      respEventHandler.asyncDevice.emit("error", new Error("Error connecting to mosquitto test"));
    }, 300);

    const sleep = ms => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    };

    await sleep(500);
    (0, _globals.expect)(_winstonLogger.default.error).toHaveBeenCalled();
  });
});
//# sourceMappingURL=mosquitto.test.js.map