"use strict";

var _globals = require("@jest/globals");

var _asyncMqtt = _interopRequireDefault(require("async-mqtt"));

var _mosquitto = require("../../controller/mosquitto");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
_globals.jest.mock("mqtt");

_globals.jest.mock("async-mqtt");

_globals.jest.mock("winston");

_globals.jest.setTimeout(10000);

const mockTopic = "/test/topic";
const mockPayload = "{'insertion_id': 81, 'insertion_id': 81}";
(0, _globals.describe)("Unit testing for the mosquitto controller", () => {
  (0, _globals.it)("Should publish to the MQTT topic", async () => {
    _globals.jest.clearAllMocks();

    const response = await (0, _mosquitto.publish)(mockTopic, mockPayload);
    (0, _globals.expect)(_asyncMqtt.default.AsyncClient().publish).toHaveBeenCalled();
    (0, _globals.expect)(_asyncMqtt.default.AsyncClient().publish).toHaveBeenCalledWith(mockTopic, mockPayload);
    (0, _globals.expect)(response).toBeDefined();
    (0, _globals.expect)(response).not.toBeNull();
    (0, _globals.expect)(response).toBe("Published");
  });
  (0, _globals.it)("Should not publish to the MQTT topic, rejecting the promise", async () => {
    _asyncMqtt.default.setErrorOnPublish(true);

    await (0, _globals.expect)((0, _mosquitto.publish)(mockTopic, mockPayload)).rejects.toThrow();
  });
});
//# sourceMappingURL=mosquitto.test.js.map