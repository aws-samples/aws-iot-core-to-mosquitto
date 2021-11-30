// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import { publish as publishToMosquitto } from "./mosquitto";
import {
  createConnectionConfigs as createConnectionToIotCore,
  createSubscribeOnConnectAndResume as createSubscriptionToIoTCoreTopic,
} from "../services/iotv2";
import { mqttBrokerInfo } from "../env";
import logger from "../utils/winstonLogger";

const decoder = new TextDecoder("utf8");

// TO-DO Valdiate the mock callback
/* istanbul ignore next */
async function sendToDeneva(topic, payload) {
  const decodePayload = decoder.decode(payload).replace(/\r?\n|\r/g, "");
  logger.info(`Payload from Cloud: ${decodePayload}`);
  const payloadObject = JSON.parse(decodePayload);
  const targetTopic = JSON.stringify(payloadObject.destinationTopic);
  //   const campaignsList = JSON.stringify(payloadObject.campaignsSortedList);
  const campaignsList = payloadObject.campaignsSortedList;
  await publishToMosquitto(targetTopic, JSON.stringify(campaignsList));
}
// eslint-disable-next-line import/prefer-default-export
export async function createSubscriptionAndConnectToTopic(topic) {
  try {
    const iotConnection = createConnectionToIotCore(
      mqttBrokerInfo.mqttClientId
    );
    if (iotConnection) {
      await createSubscriptionToIoTCoreTopic(
        iotConnection,
        topic,
        sendToDeneva
      );
      await iotConnection.connect();
    } else {
      // Resilience in error threating
      /* istanbul ignore next */
      throw new Error("No IoT Connection Created. Retrying...");
    }
  } catch (error) {
    logger.error(`Unable to subscribe to Topic. Error: ${error.message}.`);
  }
}
