"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConnectionConfigs = createConnectionConfigs;
exports.createSubscribeOnConnectAndResume = createSubscribeOnConnectAndResume;
exports.getClient = void 0;
exports.getMQTTClient = getMQTTClient;
exports.publish = publish;
exports.setIotConnection = setIotConnection;

var _awsIotDeviceSdkV = require("aws-iot-device-sdk-v2");

var _path = _interopRequireDefault(require("path"));

var _env = require("../env");

var _winstonLogger = _interopRequireDefault(require("../utils/winstonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
let ioTCoreConnection;
const clientBootstrap = new _awsIotDeviceSdkV.io.ClientBootstrap();
const logLevel = _awsIotDeviceSdkV.io.LogLevel.NONE;

_awsIotDeviceSdkV.io.enable_logging(logLevel);

let configBuilder;

const getFilePath = fname => {
  // console.log(`${dirname}/../../${fname}`);
  const filePath = _path.default.resolve("certs/", fname);

  return filePath;
};
/* istanbul ignore next */


function setIotConnection(iotConnection) {
  ioTCoreConnection = iotConnection;
  return ioTCoreConnection;
}
/**
 * Get MQTT Client
 * */


async function getMQTTClient() {
  const client = new _awsIotDeviceSdkV.mqtt.MqttClient(clientBootstrap);
  return client;
}
/**
 * Uses the new aws-device-sdk0v2 to create a connection with AWS IoT Core.
 * @param clientId Client Id used to recognize the device in the cloud.
 * @returns MqttClientConnection Client to interact with AWS IoT Core.
 */


function createConnectionConfigs(clientId) {
  const proxyOptions = new _awsIotDeviceSdkV.http.HttpProxyOptions(_env.proxyConnectionOptions.host_name, parseInt(_env.proxyConnectionOptions.port, 10));

  _winstonLogger.default.debug(`MQTT Host: ${_env.mqttBrokerInfo.brokerAddress}`);

  if (ioTCoreConnection) {
    return ioTCoreConnection;
  }

  try {
    /* istanbul ignore if */
    if (process.env.MQTT_PROTOCOL === "wss") {
      if (process.env.PROXY_ENABLED === "true") {
        configBuilder = _awsIotDeviceSdkV.iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
          region: _env.region,
          credentials_provider: _awsIotDeviceSdkV.auth.AwsCredentialsProvider.newDefault(clientBootstrap),
          proxyOptions
        });
      }
    } else {
      configBuilder = _awsIotDeviceSdkV.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(getFilePath(_env.mqttBrokerInfo.certFile), getFilePath(_env.mqttBrokerInfo.keyFile));
    }

    configBuilder.with_certificate_authority_from_path(undefined, getFilePath(_env.mqttBrokerInfo.caFile));
    configBuilder.with_client_id(clientId);
    configBuilder.with_endpoint(_env.mqttBrokerInfo.brokerAddress);
    configBuilder.with_port(443);
    configBuilder.with_ping_timeout_ms(2000);
    configBuilder.with_keep_alive_seconds(30);
    configBuilder.with_clean_session(true);

    if (_env.useProxy === "true") {
      configBuilder.with_http_proxy_options(proxyOptions);
    }

    const config = configBuilder.build();
    const client = new _awsIotDeviceSdkV.mqtt.MqttClient(clientBootstrap);
    ioTCoreConnection = client.new_connection(config);
    ioTCoreConnection.on("error", async error => {
      /* istanbul ignore next */
      if (!error.message.includes("AWS_ERROR_MQTT_ALREADY_CONNECTED")) {
        /* istanbul ignore next */
        _winstonLogger.default.error(`Connection Error: ${error.message}`);
        /* istanbul ignore next */

      } else {
        /* istanbul ignore next */
        _winstonLogger.default.error(`Already Connected: ${error.message}`);
      }
    });
    ioTCoreConnection.on("disconnect", async () => {
      /* istanbul ignore next */
      _winstonLogger.default.error("Disconnected from IoT Core.");
    });
    ioTCoreConnection.on("interrupt", async error => {
      /* istanbul ignore next */
      _winstonLogger.default.error("Connection interrupted from IoT Core.");
      /* istanbul ignore next */


      _winstonLogger.default.error(`Error: ${error.stack}`);
    });
  } catch (error) {
    throw new Error(`Unable to create IoT Connection MQTT Client. Error : ${error.message}`);
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


async function publish(connection, topic, message) {
  _winstonLogger.default.debug(`Connection: ${connection.client}`);

  try {
    const jsonMessage = JSON.stringify(message);

    _winstonLogger.default.debug(`Sending ${message} to ioTCore`);

    await connection.publish(topic, jsonMessage, _awsIotDeviceSdkV.mqtt.QoS.AtLeastOnce);

    _winstonLogger.default.debug(`file sent to topic: ${topic}`);
  } catch (error) {
    _winstonLogger.default.error(`Error publishing data to IoT Core: ${error.message}`);
  }
}

async function createSubscribeOnConnectAndResume(connection, topic, callbackOnMessageReceive) {
  console.log(`Subscribing to Topic ${topic}`); // eslint-disable-next-line no-async-promise-executor

  return new Promise(async (resolve, reject) => {
    try {
      _winstonLogger.default.debug(`Connection Details: ${JSON.stringify(connection)}`);

      connection.on("connect", async () => {
        /* istanbul ignore next */
        _winstonLogger.default.debug("Connected, Subscribing to Topic.");
        /* istanbul ignore next */


        await connection.subscribe(topic, _awsIotDeviceSdkV.mqtt.QoS.AtMostOnce, callbackOnMessageReceive);
        /* istanbul ignore next */

        _winstonLogger.default.debug("Subscribed to topic without errors.");
      });
      connection.on("resume", async (returnCode, sessionPresent) => {
        /* istanbul ignore next */
        _winstonLogger.default.info(`Reconnected to IoT Core. Return Code: ${returnCode} and Session is present: ${sessionPresent}.` + ` \n Susbcribing to IoT topic: ${topic}`);
        /* istanbul ignore next */


        await connection.subscribe(topic, _awsIotDeviceSdkV.mqtt.QoS.AtMostOnce, callbackOnMessageReceive);
        /* istanbul ignore next */

        _winstonLogger.default.debug("Subscribed to topic without errors.");
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

const getClient = getMQTTClient;
exports.getClient = getClient;
//# sourceMappingURL=iotv2.js.map