"use strict";

var _globals = require("@jest/globals");

var _awsIotDeviceSdkV = require("aws-iot-device-sdk-v2");

var _listenToTopic = require("../../controller/listenToTopic");

var _iotv = require("../../services/iotv2");

var _winstonLogger = _interopRequireDefault(require("../../utils/winstonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
_globals.jest.mock("winston");

_globals.jest.mock("aws-iot-device-sdk-v2");

(0, _globals.describe)("Unit Testing for Listen to Topic", () => {
  (0, _globals.describe)("Unit testing creating connection to IoT Core", () => {
    (0, _globals.beforeAll)(() => {
      _globals.jest.clearAllMocks();
    });
    (0, _globals.it)("Should createSubscription configuration without errors", async () => {
      await (0, _globals.expect)((0, _listenToTopic.createSubscriptionAndConnectToTopic)("test/topic")).resolves.toBeUndefined();
      (0, _globals.expect)(_winstonLogger.default.error).not.toHaveBeenCalled();
    });
    (0, _globals.it)("Should have called Connect to IoT Core", () => {
      const mockedMqttClient = _awsIotDeviceSdkV.mqtt.MqttClient;
      (0, _globals.expect)(mockedMqttClient().new_connection().connect).toHaveBeenCalled();
    });
    (0, _globals.it)("Should have set the resume and connect", async () => {
      const mockedMqttClient = _awsIotDeviceSdkV.mqtt.MqttClient;
      (0, _globals.expect)(mockedMqttClient().new_connection).toHaveBeenCalled();
      (0, _globals.expect)(mockedMqttClient().new_connection().on.mock.calls).toEqual(_globals.expect.arrayContaining([_globals.expect.arrayContaining(["connect"])]));
      (0, _globals.expect)(mockedMqttClient().new_connection().on.mock.calls).toEqual(_globals.expect.arrayContaining([_globals.expect.arrayContaining(["resume"])]));
    });
  });
  (0, _globals.describe)("Test Error Handling", () => {
    (0, _globals.beforeAll)(() => {
      _globals.jest.clearAllMocks();
    });
    const mockedMqttClient = _awsIotDeviceSdkV.mqtt.MqttClient;
    (0, _globals.it)("Should log an error if IoT conneciton wasn't created correctly", async () => {
      (0, _iotv.setIotConnection)(undefined);
      mockedMqttClient().new_connection.mockReturnValue(undefined);
      await (0, _globals.expect)((0, _listenToTopic.createSubscriptionAndConnectToTopic)("test/topic")).resolves.toBeUndefined();
      (0, _globals.expect)(_winstonLogger.default.error).toHaveBeenCalled();
    });
  });
});
//# sourceMappingURL=listenToTopic.test.js.map