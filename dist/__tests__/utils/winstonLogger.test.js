"use strict";

var _globals = require("@jest/globals");

var _winston = _interopRequireDefault(require("winston"));

var _winstonLogger = _interopRequireDefault(require("../../utils/winstonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
jest.mock("winston");
(0, _globals.describe)("Tests on winston Logger module", () => {
  (0, _globals.it)("Should create logger object", () => {
    (0, _globals.expect)(_winston.default.createLogger).toHaveBeenCalledTimes(1);
  });
  (0, _globals.it)("Should log error without Throwing an Error", () => {
    (0, _globals.expect)(() => {
      _winstonLogger.default.error("Test error");
    }).not.toThrow();
    (0, _globals.expect)(() => {
      _winstonLogger.default.info("Test info");
    }).not.toThrow();
    (0, _globals.expect)(() => {
      _winstonLogger.default.debug("Test debug");
    }).not.toThrow();
  }); // TO-DO: Add failed winston object cration test
});
//# sourceMappingURL=winstonLogger.test.js.map