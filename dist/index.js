"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;

var _listenToTopic = require("./controller/listenToTopic");

var _env = require("./env");

var _winstonLogger = _interopRequireDefault(require("./utils/winstonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
function start() {
  _winstonLogger.default.debug("Subscribing to IoT Topic");

  (0, _listenToTopic.createSubscriptionAndConnectToTopic)(_env.topicToSubscribe);
}

start();
//# sourceMappingURL=index.js.map