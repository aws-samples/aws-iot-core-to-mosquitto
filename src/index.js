// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import { createSubscriptionAndConnectToTopic } from "./controller/listenToTopic";
import { topicToSubscribe } from "./env";
import logger from "./utils/winstonLogger";

export default function start() {
  logger.debug("Subscribing to IoT Topic");
  createSubscriptionAndConnectToTopic(topicToSubscribe);
}

start();
