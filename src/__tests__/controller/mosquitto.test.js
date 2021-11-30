// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import { jest, describe, expect, it } from "@jest/globals";
import asyncMqtt from "async-mqtt";
import { publish } from "../../controller/mosquitto";

jest.mock("mqtt");
jest.mock("async-mqtt");
jest.mock("winston");
jest.setTimeout(10000);

const mockTopic = "/test/topic";

const mockPayload = "{'insertion_id': 81, 'insertion_id': 81}";

describe("Unit testing for the mosquitto controller", () => {
  it("Should publish to the MQTT topic", async () => {
    jest.clearAllMocks();
    const response = await publish(mockTopic, mockPayload);
    expect(asyncMqtt.AsyncClient().publish).toHaveBeenCalled();
    expect(asyncMqtt.AsyncClient().publish).toHaveBeenCalledWith(
      mockTopic,
      mockPayload
    );
    expect(response).toBeDefined();
    expect(response).not.toBeNull();
    expect(response).toBe("Published");
  });
  it("Should not publish to the MQTT topic, rejecting the promise", async () => {
    asyncMqtt.setErrorOnPublish(true);
    await expect(publish(mockTopic, mockPayload)).rejects.toThrow();
  });
});
