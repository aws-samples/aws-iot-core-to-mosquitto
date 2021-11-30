"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProxy = exports.topicToSubscribe = exports.stationId = exports.region = exports.proxyConnectionOptions = exports.mqttBrokerInfo = exports.mosquittoURI = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
const mqttBrokerInfo = {
  brokerAddress: process.env.MQTT_BROKER_ADDRESS,
  keyFile: process.env.MQTT_KEY_FILE,
  certFile: process.env.MQTT_CERT_FILE,
  caFile: process.env.MQTT_CA_FILE,
  mqttClientId: process.env.MQTT_CLIENT_ID
};
exports.mqttBrokerInfo = mqttBrokerInfo;
const mosquittoURI = process.env.MOSQUITTO_URI;
exports.mosquittoURI = mosquittoURI;
const region = process.env.AWS_REGION;
exports.region = region;
const topicToSubscribe = `cmd/localDevice/${process.env.ENV}/${process.env.DEVICE_ID}`;
exports.topicToSubscribe = topicToSubscribe;
const useProxy = process.env.USE_PROXY;
exports.useProxy = useProxy;
const proxyConnectionOptions = {
  host_name: process.env.PROXY_HOST,
  port: process.env.PROXY_PORT
};
exports.proxyConnectionOptions = proxyConnectionOptions;
const stationId = process.env.DEVICE_ID;
exports.stationId = stationId;
//# sourceMappingURL=env.js.map