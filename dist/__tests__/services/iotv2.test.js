"use strict";

var _globals = require("@jest/globals");

var _awsIotDeviceSdkV = require("aws-iot-device-sdk-v2");

var _path = _interopRequireDefault(require("path"));

var _iotv = require("../../services/iotv2");

var envVars = _interopRequireWildcard(require("../../env"));

var _winstonLogger = _interopRequireDefault(require("../../utils/winstonLogger"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
// import * as iotv2 from "./iotv2";
_globals.jest.mock("winston");

_globals.jest.mock("aws-iot-device-sdk-v2");

_globals.jest.setTimeout(30000);

const mockClientId = "testClientId";
const mockTopic = "test/unit/topic";
const mockMessage = "Unit Testing this module";
(0, _globals.describe)("Unit Testing for iotv2 service.", () => {
  (0, _globals.it)("Should get MQTT Client from the client bootstrap", async () => {
    const response = await (0, _iotv.getClient)();
    (0, _globals.expect)(_awsIotDeviceSdkV.io.ClientBootstrap).toHaveBeenCalled();
    (0, _globals.expect)(_awsIotDeviceSdkV.io.enable_logging).toHaveBeenCalled();
    (0, _globals.expect)(_awsIotDeviceSdkV.mqtt.MqttClient).toHaveBeenCalled();
    const mqttClientParameters = _awsIotDeviceSdkV.mqtt.MqttClient.mock.calls[0][0];
    (0, _globals.expect)(mqttClientParameters).toBeInstanceOf(_awsIotDeviceSdkV.io.ClientBootstrap);
    (0, _globals.expect)(response).toBeDefined();
    (0, _globals.expect)(response).not.toBeNull();
  });
  (0, _globals.describe)("Unit Testing configuration setup", () => {
    let firstCallResponse;
    (0, _globals.describe)("Test Setup without Proxy", () => {
      (0, _globals.it)("Should create configurations for the IoT Connection with correct parameters", () => {
        let response;

        const getFilePath = fname => {
          // console.log(`${dirname}/../../${fname}`);
          const filePath = _path.default.resolve("certs/", fname);

          return filePath;
        };

        (0, _globals.expect)(() => {
          response = (0, _iotv.createConnectionConfigs)(mockClientId);
        }).not.toThrow();
        (0, _globals.expect)(_awsIotDeviceSdkV.http.HttpProxyOptions).toHaveBeenCalledTimes(1);
        const httpProxyOptions = _awsIotDeviceSdkV.http.HttpProxyOptions.mock.calls[0];
        (0, _globals.expect)(httpProxyOptions).toEqual(_globals.expect.arrayContaining([envVars.proxyConnectionOptions.host_name, parseInt(envVars.proxyConnectionOptions.port, 10)]));

        const iotConfigBuilder = _awsIotDeviceSdkV.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path();

        const mtlsPaths = _awsIotDeviceSdkV.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path.mock.calls[0];
        (0, _globals.expect)(mtlsPaths).toEqual(_globals.expect.arrayContaining([getFilePath(envVars.mqttBrokerInfo.certFile), getFilePath(envVars.mqttBrokerInfo.keyFile)]));
        const certificateAuthority = iotConfigBuilder.with_certificate_authority_from_path.mock.calls[0][1];
        (0, _globals.expect)(certificateAuthority).toEqual(getFilePath(envVars.mqttBrokerInfo.caFile));
        const clientId = iotConfigBuilder.with_client_id.mock.calls[0][0];
        const endpoint = iotConfigBuilder.with_endpoint.mock.calls[0][0];
        const port = iotConfigBuilder.with_port.mock.calls[0][0];
        const pingTimeout = iotConfigBuilder.with_ping_timeout_ms.mock.calls[0][0];
        const keepAliveSeconds = iotConfigBuilder.with_keep_alive_seconds.mock.calls[0][0];
        const cleanSession = iotConfigBuilder.with_clean_session.mock.calls[0][0];
        const proxying = iotConfigBuilder.with_http_proxy_options.mock.calls[0];
        let proxyArguments;

        if (proxying) {
          // eslint-disable-next-line prefer-destructuring
          proxyArguments = proxying[0];
        }

        (0, _globals.expect)(clientId).toEqual(mockClientId);
        (0, _globals.expect)(endpoint).toEqual(envVars.mqttBrokerInfo.brokerAddress);
        (0, _globals.expect)(port).toBe(443);
        (0, _globals.expect)(pingTimeout).toBe(2000);
        (0, _globals.expect)(keepAliveSeconds).toBe(30);
        (0, _globals.expect)(cleanSession).toBe(true);
        (0, _globals.expect)(iotConfigBuilder.build).toHaveBeenCalled(); // correct the testing for proxying, this should be mocked to test both cases.

        if (proxying) {
          // eslint-disable-next-line jest/no-conditional-expect
          (0, _globals.expect)(proxyArguments).toEqual(_globals.expect.objectContaining({
            host_name: _globals.expect.toBe(envVars.proxyConnectionOptions.host_name),
            port: _globals.expect.any(Number)
          }));
        }

        const mockedMqttClient = _awsIotDeviceSdkV.mqtt.MqttClient;
        (0, _globals.expect)(mockedMqttClient).toHaveBeenCalled();
        const mqttClientParameters = mockedMqttClient.mock.calls[0][0];
        console.log(mqttClientParameters);
        (0, _globals.expect)(mqttClientParameters).toBeInstanceOf(_awsIotDeviceSdkV.io.ClientBootstrap); // Isn't working Don't know why

        (0, _globals.expect)(mockedMqttClient().new_connection).toHaveBeenCalled();
        const mqttConfig = mockedMqttClient().new_connection.mock.calls[0][0];
        (0, _globals.expect)(mqttConfig).toBe("Built Configurations");
        (0, _globals.expect)(mockedMqttClient().new_connection().on).toHaveBeenCalled(); // const eventsArray = [];
        // mockedMqttClient()
        //   .new_connection()
        //   .on.mock.calls.forEach((eventArray) => eventsArray.push(eventArray[0]));
        // const expectedEvents = ["error", "disconnect", "interrupt"];
        // expect(eventsArray).toEqual(expect.arrayContaining(expectedEvents));

        (0, _globals.expect)(response).toBeDefined();
        (0, _globals.expect)(response).not.toBeNull();
        firstCallResponse = response;
      });
      (0, _globals.it)("Should compare a second call to the first call and IoTConfigs should Match", () => {
        const response = (0, _iotv.createConnectionConfigs)(mockClientId);
        (0, _globals.expect)(response).toEqual(firstCallResponse);
      });
    });
    (0, _globals.describe)("Test Setup with proxy", () => {
      (0, _globals.beforeEach)(() => {
        _globals.jest.clearAllMocks();
      });
      (0, _globals.it)("Should set MQTT connection with proxy options", () => {
        (0, _iotv.setIotConnection)(undefined); // eslint-disable-next-line no-import-assign

        Object.defineProperty(envVars, "useProxy", {
          value: "true"
        });
        (0, _iotv.createConnectionConfigs)(mockClientId);

        const iotConfigBuilder = _awsIotDeviceSdkV.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path();

        (0, _globals.expect)(iotConfigBuilder.with_http_proxy_options).toHaveBeenCalled();
        console.log(iotConfigBuilder.with_http_proxy_options.mock.calls);
        (0, _globals.expect)(iotConfigBuilder.with_http_proxy_options.mock.calls[0][0]).toBeInstanceOf(_awsIotDeviceSdkV.http.HttpProxyOptions);
      });
    });
  });
  (0, _globals.describe)("Testing Pub functions", () => {
    (0, _globals.beforeAll)(() => {
      _globals.jest.clearAllMocks();
    });
    (0, _globals.it)("Should try to publish against to a topic", async () => {
      const mockConnection = (0, _iotv.createConnectionConfigs)(mockClientId);
      await (0, _iotv.publish)(mockConnection, mockTopic, mockMessage);
      (0, _globals.expect)(_awsIotDeviceSdkV.mqtt.MqttClient().new_connection().publish).toHaveBeenCalledTimes(1);
      (0, _globals.expect)(_winstonLogger.default.error).not.toHaveBeenCalled();
    });
  });
  (0, _globals.describe)("Testing subscribe to topic in the connect event", () => {
    (0, _globals.it)("should subscribe on connect and on resumes", async () => {
      _globals.jest.clearAllMocks();

      const mockConnection = (0, _iotv.createConnectionConfigs)(mockClientId);

      const mockCallback = _globals.jest.fn();

      await (0, _globals.expect)((0, _iotv.createSubscribeOnConnectAndResume)(mockConnection, "test/topic", mockCallback)).resolves.toBeUndefined();
      (0, _globals.expect)(mockConnection.on.mock.calls[0][0]).toBe("connect");
      (0, _globals.expect)(mockConnection.on.mock.calls[1][0]).toBe("resume");
    });
  });
  (0, _globals.describe)("Testing errors", () => {
    (0, _globals.it)("Should throw an error if unable to create connection", () => {
      (0, _iotv.setIotConnection)(undefined);

      const iotConfigBuilder = _awsIotDeviceSdkV.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path();

      iotConfigBuilder.build = _globals.jest.fn(() => {
        throw new Error("Error Creating config");
      });
      (0, _globals.expect)(() => {
        (0, _iotv.createConnectionConfigs)(mockClientId);
      }).toThrow();
    });
    (0, _globals.it)("Should reject if error or timeout", async () => {
      _globals.jest.clearAllMocks();

      const iotConfigBuilder = _awsIotDeviceSdkV.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path();

      iotConfigBuilder.build = _globals.jest.fn().mockReturnValue("Built Configurations");
      _awsIotDeviceSdkV.mqtt.MqttClient().new_connection().publish = _globals.jest.fn(() => {
        throw new Error(" Error Publishing to IoT Core");
      });
      const mockConnection = (0, _iotv.createConnectionConfigs)(mockClientId);
      await (0, _iotv.publish)(mockConnection, mockTopic, mockMessage);
      (0, _globals.expect)(_winstonLogger.default.error).toHaveBeenCalled();
    });
  });
});
//# sourceMappingURL=iotv2.test.js.map