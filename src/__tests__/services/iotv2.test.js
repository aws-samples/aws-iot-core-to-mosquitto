// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest,
  describe,
  expect,
  it,
  beforeAll,
  beforeEach,
} from "@jest/globals";
import { mqtt, http, io, iot } from "aws-iot-device-sdk-v2";
// import * as iotv2 from "./iotv2";
import path from "path";
import {
  getClient,
  createConnectionConfigs,
  publish,
  setIotConnection,
  createSubscribeOnConnectAndResume,
} from "../../services/iotv2";
import * as envVars from "../../env";
import { mqttBrokerInfo, proxyConnectionOptions } from "../../env";
import logger from "../../utils/winstonLogger";

jest.mock("winston");
jest.mock("aws-iot-device-sdk-v2");
jest.setTimeout(30000);

const mockClientId = "testClientId";
const mockTopic = "test/unit/topic";
const mockMessage = "Unit Testing this module";

describe("Unit Testing for iotv2 service.", () => {
  it("Should get MQTT Client from the client bootstrap", async () => {
    const response = await getClient();
    expect(io.ClientBootstrap).toHaveBeenCalled();
    expect(io.enable_logging).toHaveBeenCalled();
    expect(mqtt.MqttClient).toHaveBeenCalled();
    const mqttClientParameters = mqtt.MqttClient.mock.calls[0][0];
    expect(mqttClientParameters).toBeInstanceOf(io.ClientBootstrap);
    expect(response).toBeDefined();
    expect(response).not.toBeNull();
  });

  describe("Unit Testing configuration setup", () => {
    let firstCallResponse;

    describe("Test Setup without Proxy", () => {
      it("Should create configurations for the IoT Connection with correct parameters", () => {
        let response;
        const getFilePath = (fname) => {
          // console.log(`${dirname}/../../${fname}`);
          const filePath = path.resolve("certs/", fname);
          return filePath;
        };
        expect(() => {
          response = createConnectionConfigs(mockClientId);
        }).not.toThrow();

        expect(http.HttpProxyOptions).toHaveBeenCalledTimes(1);
        const httpProxyOptions = http.HttpProxyOptions.mock.calls[0];
        expect(httpProxyOptions).toEqual(
          expect.arrayContaining([
            proxyConnectionOptions.host_name,
            parseInt(proxyConnectionOptions.port, 10),
          ])
        );
        const iotConfigBuilder =
          iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path();
        const mtlsPaths =
          iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path.mock
            .calls[0];
        expect(mtlsPaths).toEqual(
          expect.arrayContaining([
            getFilePath(mqttBrokerInfo.certFile),
            getFilePath(mqttBrokerInfo.keyFile),
          ])
        );
        const certificateAuthority =
          iotConfigBuilder.with_certificate_authority_from_path.mock
            .calls[0][1];
        expect(certificateAuthority).toEqual(
          getFilePath(mqttBrokerInfo.caFile)
        );

        const clientId = iotConfigBuilder.with_client_id.mock.calls[0][0];
        const endpoint = iotConfigBuilder.with_endpoint.mock.calls[0][0];
        const port = iotConfigBuilder.with_port.mock.calls[0][0];
        const pingTimeout =
          iotConfigBuilder.with_ping_timeout_ms.mock.calls[0][0];
        const keepAliveSeconds =
          iotConfigBuilder.with_keep_alive_seconds.mock.calls[0][0];
        const cleanSession =
          iotConfigBuilder.with_clean_session.mock.calls[0][0];
        const proxying = iotConfigBuilder.with_http_proxy_options.mock.calls[0];
        let proxyArguments;
        if (proxying) {
          // eslint-disable-next-line prefer-destructuring
          proxyArguments = proxying[0];
        }

        expect(clientId).toEqual(mockClientId);
        expect(endpoint).toEqual(mqttBrokerInfo.brokerAddress);
        expect(port).toBe(443);
        expect(pingTimeout).toBe(2000);
        expect(keepAliveSeconds).toBe(30);
        expect(cleanSession).toBe(true);

        expect(iotConfigBuilder.build).toHaveBeenCalled();
        // correct the testing for proxying, this should be mocked to test both cases.
        if (proxying) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(proxyArguments).toEqual(
            expect.objectContaining({
              host_name: expect.toBe(proxyConnectionOptions.host_name),
              port: expect.any(Number),
            })
          );
        }
        const mockedMqttClient = mqtt.MqttClient;
        expect(mockedMqttClient).toHaveBeenCalled();
        const mqttClientParameters = mockedMqttClient.mock.calls[0][0];
        console.log(mqttClientParameters);
        expect(mqttClientParameters).toBeInstanceOf(io.ClientBootstrap);

        // Isn't working Don't know why
        expect(mockedMqttClient().new_connection).toHaveBeenCalled();
        const mqttConfig = mockedMqttClient().new_connection.mock.calls[0][0];
        expect(mqttConfig).toBe("Built Configurations");
        expect(mockedMqttClient().new_connection().on).toHaveBeenCalled();

        // const eventsArray = [];

        // mockedMqttClient()
        //   .new_connection()
        //   .on.mock.calls.forEach((eventArray) => eventsArray.push(eventArray[0]));

        // const expectedEvents = ["error", "disconnect", "interrupt"];

        // expect(eventsArray).toEqual(expect.arrayContaining(expectedEvents));

        expect(response).toBeDefined();
        expect(response).not.toBeNull();
        firstCallResponse = response;
      });

      it("Should compare a second call to the first call and IoTConfigs should Match", () => {
        const response = createConnectionConfigs(mockClientId);
        expect(response).toEqual(firstCallResponse);
      });
    });

    describe("Test Setup with proxy", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it("Should set MQTT connection with proxy options", () => {
        setIotConnection(undefined);
        // eslint-disable-next-line no-import-assign
        Object.defineProperty(envVars, "useProxy", { value: "true" });
        createConnectionConfigs(mockClientId);
        const iotConfigBuilder =
          iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path();
        expect(iotConfigBuilder.with_http_proxy_options).toHaveBeenCalled();
        console.log(iotConfigBuilder.with_http_proxy_options.mock.calls);
        expect(
          iotConfigBuilder.with_http_proxy_options.mock.calls[0][0]
        ).toBeInstanceOf(http.HttpProxyOptions);
      });
    });
  });

  describe("Testing Pub functions", () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("Should try to publish against to a topic", async () => {
      const mockConnection = createConnectionConfigs(mockClientId);
      await publish(mockConnection, mockTopic, mockMessage);
      expect(mqtt.MqttClient().new_connection().publish).toHaveBeenCalledTimes(
        1
      );
      expect(logger.error).not.toHaveBeenCalled();
    });
  });

  describe("Testing subscribe to topic in the connect event", () => {
    it("should subscribe on connect and on resumes", async () => {
      jest.clearAllMocks();
      const mockConnection = createConnectionConfigs(mockClientId);
      const mockCallback = jest.fn();
      await expect(
        createSubscribeOnConnectAndResume(
          mockConnection,
          "test/topic",
          mockCallback
        )
      ).resolves.toBeUndefined();
      expect(mockConnection.on.mock.calls[0][0]).toBe("connect");
      expect(mockConnection.on.mock.calls[1][0]).toBe("resume");
    });
  });

  describe("Testing errors", () => {
    it("Should throw an error if unable to create connection", () => {
      setIotConnection(undefined);
      const iotConfigBuilder =
        iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path();
      iotConfigBuilder.build = jest.fn(() => {
        throw new Error("Error Creating config");
      });
      expect(() => {
        createConnectionConfigs(mockClientId);
      }).toThrow();
    });

    it("Should reject if error or timeout", async () => {
      jest.clearAllMocks();
      const iotConfigBuilder =
        iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path();
      iotConfigBuilder.build = jest
        .fn()
        .mockReturnValue("Built Configurations");

      mqtt.MqttClient().new_connection().publish = jest.fn(() => {
        throw new Error(" Error Publishing to IoT Core");
      });

      const mockConnection = createConnectionConfigs(mockClientId);

      await publish(mockConnection, mockTopic, mockMessage);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
