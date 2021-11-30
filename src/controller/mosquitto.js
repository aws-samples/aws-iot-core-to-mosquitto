// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import { mosquittoURI } from "../env";
import { getMQTTClient } from "../services/mosquitto";
import logger from "../utils/winstonLogger";

// eslint-disable-next-line import/prefer-default-export
export async function publish(topic, payload) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const mosquittoClient = await getMQTTClient(mosquittoURI);
      const cleanTopic = topic.replace(/['"]+/g, "");
      logger.info(`Sending message on topic: ${cleanTopic}`);
      // await mosquittoClient.asyncDevice.subscribe(cleanTopic);
      const publishMessage = await mosquittoClient.asyncDevice.publish(
        cleanTopic,
        payload
      );
      // await mosquittoClient.asyncDevice.unsubscribe(cleanTopic);
      logger.info("Message Sent to Mosquitto Topic");
      resolve(publishMessage);
    } catch (error) {
      reject(
        new Error(`Not able to publish data to Mosquitto. Error: ${error}`)
      );
    }
  });
}
