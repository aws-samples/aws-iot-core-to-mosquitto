// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import MQTT from "mqtt";
import pkg from "async-mqtt";
import logger from "../utils/winstonLogger";

const { AsyncClient } = pkg;

let mqtt;

/**
 * Get MQTT Mosquitto Client
 * @param {object} options
 * */
// eslint-disable-next-line import/prefer-default-export
export async function getMQTTClient(mosquittoURI) {
  if (mqtt) {
    return mqtt;
  }

  return new Promise((resolve, reject) => {
    logger.info(`Mosquitto Broker: ${mosquittoURI}`);
    const device = MQTT.connect(mosquittoURI);
    const asyncDevice = new AsyncClient(device);

    asyncDevice.on("message", (t, msg) => {
      logger.info(`Got a message on "${t}"...`);
      logger.info(msg.toString());
    });

    asyncDevice.on("connect", () => {
      logger.debug("Connected to MQTT Mosquitto broker...");
      mqtt = {
        device,
        asyncDevice,
      };
      resolve(mqtt);
    });

    asyncDevice.on("error", (err) => {
      logger.error(`Error when connecting to Mosquitto broker: ${err.message}`);
      // reconnectInMs(asyncDevice, 2000);
      reject(err);
    });
  });
}
