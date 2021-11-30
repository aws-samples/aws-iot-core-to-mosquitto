// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from "@jest/globals";

// let winston = jest.createMockFromModule("winston");

const trueWinston = jest.requireActual("winston");

const winston = {
  ...trueWinston,
};

function error(msg) {
  console.log(msg);
}

function info(msg) {
  console.log(msg);
}

function debug(msg) {
  console.log(msg);
}

const logger = {
  error: jest.fn(error),
  info: jest.fn().mockImplementation(info),
  debug: jest.fn().mockImplementation(debug),
};

winston.createLogger = jest.fn().mockReturnValue(logger);

export default winston;
