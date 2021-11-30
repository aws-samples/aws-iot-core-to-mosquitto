// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import { jest, describe, expect, it, beforeAll } from "@jest/globals";
import { mqtt } from "aws-iot-device-sdk-v2";
import { createSubscriptionAndConnectToTopic } from "../../controller/listenToTopic";
import { setIotConnection } from "../../services/iotv2";
import logger from "../../utils/winstonLogger";

jest.mock("winston");
jest.mock("aws-iot-device-sdk-v2");

describe("Unit Testing for Listen to Topic", () => {
  describe("Unit testing creating connection to IoT Core", () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });
    it("Should createSubscription configuration without errors", async () => {
      await expect(
        createSubscriptionAndConnectToTopic("test/topic")
      ).resolves.toBeUndefined();
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("Should have called Connect to IoT Core", () => {
      const mockedMqttClient = mqtt.MqttClient;
      expect(mockedMqttClient().new_connection().connect).toHaveBeenCalled();
    });

    it("Should have set the resume and connect", async () => {
      const mockedMqttClient = mqtt.MqttClient;
      expect(mockedMqttClient().new_connection).toHaveBeenCalled();
      expect(mockedMqttClient().new_connection().on.mock.calls).toEqual(
        expect.arrayContaining([expect.arrayContaining(["connect"])])
      );
      expect(mockedMqttClient().new_connection().on.mock.calls).toEqual(
        expect.arrayContaining([expect.arrayContaining(["resume"])])
      );
    });
  });
  describe("Test Error Handling", () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });
    const mockedMqttClient = mqtt.MqttClient;
    it("Should log an error if IoT conneciton wasn't created correctly", async () => {
      setIotConnection(undefined);
      mockedMqttClient().new_connection.mockReturnValue(undefined);
      await expect(
        createSubscriptionAndConnectToTopic("test/topic")
      ).resolves.toBeUndefined();
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
