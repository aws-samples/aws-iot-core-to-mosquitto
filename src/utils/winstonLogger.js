// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import appRoot from "app-root-path";
// eslint-disable-next-line no-unused-vars
import winston from "winston";

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
    filename: `${appRoot}/logs/aws-iot-core-to-mosquitto-errors.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  debug: {
    level: "debug",
    json: false,
    colorize: false,
  },
};

// eslint-disable-next-line new-cap
const logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.error),
    new winston.transports.Console(options.debug),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss" }),
    winston.format.printf(
      /* istanbul ignore next */
      (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
    )
  ),
  exitOnError: false,
});
/* istanbul ignore next */
logger.stream = {
  write(message) {
    logger.info(message);
  },
};

export default logger;
