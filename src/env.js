// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

export const mqttBrokerInfo = {
  brokerAddress: process.env.MQTT_BROKER_ADDRESS,
  keyFile: process.env.MQTT_KEY_FILE,
  certFile: process.env.MQTT_CERT_FILE,
  caFile: process.env.MQTT_CA_FILE,
  mqttClientId: process.env.MQTT_CLIENT_ID,
};

export const mosquittoURI = process.env.MOSQUITTO_URI;

export const region = process.env.AWS_REGION;

export const topicToSubscribe = `cmd/localDevice/${process.env.ENV}/${process.env.DEVICE_ID}`;

export const useProxy = process.env.USE_PROXY;

export const proxyConnectionOptions = {
  host_name: process.env.PROXY_HOST,
  port: process.env.PROXY_PORT,
};

export const stationId = process.env.DEVICE_ID;
