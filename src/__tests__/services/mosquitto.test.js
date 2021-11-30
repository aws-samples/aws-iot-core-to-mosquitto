// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import { jest, describe, expect, it } from "@jest/globals";
import MQTT from "mqtt";
import { getMQTTClient } from "../../services/mosquitto";
import logger from "../../utils/winstonLogger";

jest.mock("mqtt");
jest.mock("async-mqtt");
jest.mock("winston");
jest.setTimeout(6000);

describe("Unit testing for the mosquitto service", () => {
  it("Should get the MQTT Client with it's properties", async () => {
    const respEventHandler = await getMQTTClient("WHATEVER");
    // setTimeout(() => {
    //   self.emit("connect");
    // }, 300);
    expect(MQTT.connect).toHaveBeenCalledTimes(1);
    expect(respEventHandler).toHaveProperty("device");
    expect(respEventHandler).toHaveProperty("asyncDevice");
    expect(respEventHandler.device).toHaveProperty("publish");
    expect(respEventHandler.device).toHaveProperty("subscribe");
    expect(respEventHandler.asyncDevice).toHaveProperty("publish");
    expect(respEventHandler.asyncDevice).toHaveProperty("subscribe");
  });

  it("Should log an error if an error event occurs", async () => {
    jest.clearAllMocks();
    const respEventHandler = await getMQTTClient("WHATEVER");
    setTimeout(() => {
      respEventHandler.asyncDevice.emit(
        "error",
        new Error("Error connecting to mosquitto test")
      );
    }, 300);

    const sleep = (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };
    await sleep(500);
    expect(logger.error).toHaveBeenCalled();
  });
});
