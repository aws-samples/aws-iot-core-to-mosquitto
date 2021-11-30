// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, it } from "@jest/globals";
import winston from "winston";
import logger from "../../utils/winstonLogger";

jest.mock("winston");

describe("Tests on winston Logger module", () => {
  it("Should create logger object", () => {
    expect(winston.createLogger).toHaveBeenCalledTimes(1);
  });
  it("Should log error without Throwing an Error", () => {
    expect(() => {
      logger.error("Test error");
    }).not.toThrow();
    expect(() => {
      logger.info("Test info");
    }).not.toThrow();
    expect(() => {
      logger.debug("Test debug");
    }).not.toThrow();
  });
  // TO-DO: Add failed winston object cration test
});
