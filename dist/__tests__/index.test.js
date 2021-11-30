"use strict";

var _globals = require("@jest/globals");

var _awsIotDeviceSdkV = require("aws-iot-device-sdk-v2");

var _winstonLogger = _interopRequireDefault(require("../utils/winstonLogger"));

var _iotv = require("../services/iotv2");

var _index = _interopRequireDefault(require("../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
_globals.jest.mock("winston");

_globals.jest.mock("aws-iot-device-sdk-v2");

(0, _globals.describe)("unit tests for the main function start", () => {
  (0, _globals.beforeAll)(() => {
    _globals.jest.clearAllMocks();
  });
  (0, _globals.it)("Should createSubscription configuration without errors", async () => {
    (0, _globals.expect)(() => {
      (0, _index.default)();
    }).not.toThrow();
    (0, _globals.expect)(_winstonLogger.default.error).not.toHaveBeenCalled();
  });
  (0, _globals.it)("Should handle errors and not break", async () => {
    const mockedMqttClient = _awsIotDeviceSdkV.mqtt.MqttClient;
    (0, _iotv.setIotConnection)(undefined);
    mockedMqttClient().new_connection.mockImplementation(() => {
      throw new Error("Unable to create connection");
    });
    (0, _globals.expect)(() => {
      (0, _index.default)();
    }).not.toThrow();
    (0, _globals.expect)(_winstonLogger.default.error).toHaveBeenCalled();
  });
});
//# sourceMappingURL=index.test.js.map