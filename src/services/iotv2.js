// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import { mqtt, auth, http, io, iot } from "aws-iot-device-sdk-v2";
import path from "path";
import {
  mqttBrokerInfo,
  proxyConnectionOptions,
  region,
  useProxy,
} from "../env";
import logger from "../utils/winstonLogger";

let ioTCoreConnection;
const clientBootstrap = new io.ClientBootstrap();
const logLevel = io.LogLevel.NONE;
io.enable_logging(logLevel);

let configBuilder;
const getFilePath = (fname) => {
  // console.log(`${dirname}/../../${fname}`);
  const filePath = path.resolve("certs/", fname);
  return filePath;
};

/* istanbul ignore next */
export function setIotConnection(iotConnection) {
  ioTCoreConnection = iotConnection;
  return ioTCoreConnection;
}

/**
 * Get MQTT Client
 * */
export async function getMQTTClient() {
  const client = new mqtt.MqttClient(clientBootstrap);
  return client;
}

/**
 * Uses the new aws-device-sdk0v2 to create a connection with AWS IoT Core.
 * @param clientId Client Id used to recognize the device in the cloud.
 * @returns MqttClientConnection Client to interact with AWS IoT Core.
 */
export function createConnectionConfigs(clientId) {
  const proxyOptions = new http.HttpProxyOptions(
    proxyConnectionOptions.host_name,
    parseInt(proxyConnectionOptions.port, 10)
  );

  logger.debug(`MQTT Host: ${mqttBrokerInfo.brokerAddress}`);
  if (ioTCoreConnection) {
    return ioTCoreConnection;
  }
  try {
    /* istanbul ignore if */
    if (process.env.MQTT_PROTOCOL === "wss") {
      if (process.env.PROXY_ENABLED === "true") {
        configBuilder =
          iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
            region,
            credentials_provider:
              auth.AwsCredentialsProvider.newDefault(clientBootstrap),
            proxyOptions,
          });
      }
    } else {
      configBuilder =
        iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
          getFilePath(mqttBrokerInfo.certFile),
          getFilePath(mqttBrokerInfo.keyFile)
        );
    }

    configBuilder.with_certificate_authority_from_path(
      undefined,
      getFilePath(mqttBrokerInfo.caFile)
    );

    configBuilder.with_client_id(clientId);
    configBuilder.with_endpoint(mqttBrokerInfo.brokerAddress);
    configBuilder.with_port(443);
    configBuilder.with_ping_timeout_ms(2000);
    configBuilder.with_keep_alive_seconds(30);
    configBuilder.with_clean_session(true);

    if (useProxy === "true") {
      configBuilder.with_http_proxy_options(proxyOptions);
    }

    const config = configBuilder.build();
    const client = new mqtt.MqttClient(clientBootstrap);
    ioTCoreConnection = client.new_connection(config);

    ioTCoreConnection.on("error", async (error) => {
      /* istanbul ignore next */
      if (!error.message.includes("AWS_ERROR_MQTT_ALREADY_CONNECTED")) {
        /* istanbul ignore next */
        logger.error(`Connection Error: ${error.message}`);
        /* istanbul ignore next */
      } else {
        /* istanbul ignore next */
        logger.error(`Already Connected: ${error.message}`);
      }
    });
    ioTCoreConnection.on("disconnect", async () => {
      /* istanbul ignore next */
      logger.error("Disconnected from IoT Core.");
    });
    ioTCoreConnection.on("interrupt", async (error) => {
      /* istanbul ignore next */
      logger.error("Connection interrupted from IoT Core.");
      /* istanbul ignore next */
      logger.error(`Error: ${error.stack}`);
    });
  } catch (error) {
    throw new Error(
      `Unable to create IoT Connection MQTT Client. Error : ${error.message}`
    );
  }
  return ioTCoreConnection;
}

/**
 * Publishes IoT messages to the AWS IoT Core topic asynchronously
 * @param connection The client connection AWS IoT Core
 * @param topic Topic where the message should be published to
 * @param message Message to be sent to the IoT Topic
 * @returns a Promise for status of the message being published, sucessfull or not.
 */
export async function publish(connection, topic, message) {
  logger.debug(`Connection: ${connection.client}`);
  try {
    const jsonMessage = JSON.stringify(message);
    logger.debug(`Sending ${message} to ioTCore`);
    await connection.publish(topic, jsonMessage, mqtt.QoS.AtLeastOnce);
    logger.debug(`file sent to topic: ${topic}`);
  } catch (error) {
    logger.error(`Error publishing data to IoT Core: ${error.message}`);
  }
}

export async function createSubscribeOnConnectAndResume(
  connection,
  topic,
  callbackOnMessageReceive
) {
  console.log(`Subscribing to Topic ${topic}`);
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      logger.debug(`Connection Details: ${JSON.stringify(connection)}`);

      connection.on("connect", async () => {
        /* istanbul ignore next */
        logger.debug("Connected, Subscribing to Topic.");
        /* istanbul ignore next */
        await connection.subscribe(
          topic,
          mqtt.QoS.AtMostOnce,
          callbackOnMessageReceive
        );
        /* istanbul ignore next */
        logger.debug("Subscribed to topic without errors.");
      });

      connection.on("resume", async (returnCode, sessionPresent) => {
        /* istanbul ignore next */
        logger.info(
          `Reconnected to IoT Core. Return Code: ${returnCode} and Session is present: ${sessionPresent}.` +
            ` \n Susbcribing to IoT topic: ${topic}`
        );
        /* istanbul ignore next */
        await connection.subscribe(
          topic,
          mqtt.QoS.AtMostOnce,
          callbackOnMessageReceive
        );
        /* istanbul ignore next */
        logger.debug("Subscribed to topic without errors.");
      });
      /* istanbul ignore next */
      console.log(`Listening to messages on topic ${topic}`);
      resolve();
    } catch (error) {
      /* istanbul ignore next */
      reject(error);
    }
  });
}

export const getClient = getMQTTClient;
