"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _appRootPath = _interopRequireDefault(require("app-root-path"));

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line no-unused-vars

/**
 *
 * level - Level of messages to log. 0: error, 1: warn, 2: info, 3: verbose, 4: debug, 5: silly
 * filename - The file to be used to write log data to.
 * handleExceptions - Catch and log unhandled exceptions.
 * json - Records log data in JSON format.
 * maxsize - Max size of log file, in bytes, before a new file will be created.
 * maxFiles - Limit the number of files created when the size of the logfile is exceeded.
 * colorize - Colorize the output. This can be helpful when looking at console logs.
 *
 */
const options = {
  error: {
    level: "error",
    filename: `${_appRootPath.default}/logs/aws-iot-core-to-mosquitto-errors.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    // 5MB
    maxFiles: 5,
    colorize: true
  },
  debug: {
    level: "debug",
    json: false,
    colorize: false
  }
}; // eslint-disable-next-line new-cap

const logger = new _winston.default.createLogger({
  transports: [new _winston.default.transports.File(options.error), new _winston.default.transports.Console(options.debug)],
  format: _winston.default.format.combine(_winston.default.format.timestamp({
    format: "DD-MMM-YYYY HH:mm:ss"
  }), _winston.default.format.printf(
  /* istanbul ignore next */
  info => `${info.level}: ${[info.timestamp]}: ${info.message}`)),
  exitOnError: false
});
/* istanbul ignore next */

logger.stream = {
  write(message) {
    logger.info(message);
  }

};
var _default = logger;
exports.default = _default;
//# sourceMappingURL=winstonLogger.js.map