// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import { jest, describe, expect, it, beforeAll } from "@jest/globals";
import { mqtt } from "aws-iot-device-sdk-v2";
import logger from "../utils/winstonLogger";
import { setIotConnection } from "../services/iotv2";
import start from "../index";

jest.mock("winston");
jest.mock("aws-iot-device-sdk-v2");

describe("unit tests for the main function start", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  it("Should createSubscription configuration without errors", async () => {
    expect(() => {
      start();
    }).not.toThrow();
    expect(logger.error).not.toHaveBeenCalled();
  });
  it("Should handle errors and not break", async () => {
    const mockedMqttClient = mqtt.MqttClient;
    setIotConnection(undefined);
    mockedMqttClient().new_connection.mockImplementation(() => {
      throw new Error("Unable to create connection");
    });
    expect(() => {
      start();
    }).not.toThrow();
    expect(logger.error).toHaveBeenCalled();
  });
});
