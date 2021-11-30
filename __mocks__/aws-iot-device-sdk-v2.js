// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from "@jest/globals";

// {
//   __esModule: true,
//   iotidentity: {
//     __esModule: true,
//     model: {
//       __esModule: true,
//     },
//     IotIdentityError: function IotIdentityError() {return mockConstructor.apply(this,arguments);},
//     IotIdentityClient: function IotIdentityClient() {return mockConstructor.apply(this,arguments);},
//   },
//   greengrass: {
//     __esModule: true,
//     model: {
//       __esModule: true,
//       ConnectivityInfo: function ConnectivityInfo() {return mockConstructor.apply(this,arguments);},
//       GGCore: function GGCore() {return mockConstructor.apply(this,arguments);},
//       GGGroup: function GGGroup() {return mockConstructor.apply(this,arguments);},
//       DiscoverResponse: function DiscoverResponse() {return mockConstructor.apply(this,arguments);},
//     },
//     DiscoveryError: function DiscoveryError() {return mockConstructor.apply(this,arguments);},
//     DiscoveryClient: function DiscoveryClient() {return mockConstructor.apply(this,arguments);},
//   },
//   iotjobs: {
//     __esModule: true,
//     model: {
//       __esModule: true,
//       RejectedErrorCode: {
//         UNKNOWN_ENUM_VALUE: "UNKNOWN_ENUM_VALUE",
//         INVALID_TOPIC: "InvalidTopic",
//         INVALID_STATE_TRANSITION: "InvalidStateTransition",
//         RESOURCE_NOT_FOUND: "ResourceNotFound",
//         INVALID_REQUEST: "InvalidRequest",
//         REQUEST_THROTTLED: "RequestThrottled",
//         INTERNAL_ERROR: "InternalError",
//         TERMINAL_STATE_REACHED: "TerminalStateReached",
//         INVALID_JSON: "InvalidJson",
//         VERSION_MISMATCH: "VersionMismatch",
//       },
//       JobStatus: {
//         UNKNOWN_ENUM_VALUE: "UNKNOWN_ENUM_VALUE",
//         IN_PROGRESS: "IN_PROGRESS",
//         FAILED: "FAILED",
//         QUEUED: "QUEUED",
//         TIMED_OUT: "TIMED_OUT",
//         SUCCEEDED: "SUCCEEDED",
//         CANCELED: "CANCELED",
//         REJECTED: "REJECTED",
//         REMOVED: "REMOVED",
//       },
//     },
//     IotJobsError: function IotJobsError() {return mockConstructor.apply(this,arguments);},
//     IotJobsClient: function IotJobsClient() {return mockConstructor.apply(this,arguments);},
//   },
//   iotshadow: {
//     __esModule: true,
//     model: {
//       __esModule: true,
//     },
//     IotShadowError: function IotShadowError() {return mockConstructor.apply(this,arguments);},
//     IotShadowClient: function IotShadowClient() {return mockConstructor.apply(this,arguments);},
//   },
//   mqtt: {
//     __esModule: true,
//     MqttClient: function MqttClient() {return mockConstructor.apply(this,arguments);},
//     MqttClientConnection: function MqttClientConnection() {return mockConstructor.apply(this,arguments);},
//     HttpProxyOptions: function HttpProxyOptions() {return mockConstructor.apply(this,arguments);},
//     QoS: {
//       "0": "AtMostOnce",
//       "1": "AtLeastOnce",
//       "2": "ExactlyOnce",
//       AtMostOnce: 0,
//       AtLeastOnce: 1,
//       ExactlyOnce: 2,
//     },
//     MqttWill: function MqttWill() {return mockConstructor.apply(this,arguments);},
//   },
//   auth: {
//     __esModule: true,
//     AwsSigningAlgorithm: {
//       "0": "SigV4",
//       "1": "SigV4Asymmetric",
//       SigV4: 0,
//       SigV4Asymmetric: 1,
//     },
//     AwsSignatureType: {
//       "0": "HttpRequestViaHeaders",
//       "1": "HttpRequestViaQueryParams",
//       "2": "HttpRequestChunk",
//       "3": "HttpRequestEvent",
//       HttpRequestViaHeaders: 0,
//       HttpRequestViaQueryParams: 1,
//       HttpRequestChunk: 2,
//       HttpRequestEvent: 3,
//     },
//     AwsSignedBodyValue: {
//       EmptySha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
//       UnsignedPayload: "UNSIGNED-PAYLOAD",
//       StreamingAws4HmacSha256Payload: "STREAMING-AWS4-HMAC-SHA256-PAYLOAD",
//       StreamingAws4HmacSha256Events: "STREAMING-AWS4-HMAC-SHA256-EVENTS",
//     },
//     AwsSignedBodyHeaderType: {
//       "0": "None",
//       "1": "XAmzContentSha256",
//       None: 0,
//       XAmzContentSha256: 1,
//     },
//     AwsCredentialsProvider: function AwsCredentialsProvider() {return mockConstructor.apply(this,arguments);},
//     aws_sign_request: function aws$sign$request() {return mockConstructor.apply(this,arguments);},
//     aws_verify_sigv4a_signing: function aws$verify$sigv4a$signing() {return mockConstructor.apply(this,arguments);},
//   },
//   http: {
//     __esModule: true,
//     HttpHeaders: function HttpHeaders() {return mockConstructor.apply(this,arguments);},
//     HttpRequest: function HttpRequest() {return mockConstructor.apply(this,arguments);},
//     HttpConnection: function HttpConnection() {return mockConstructor.apply(this,arguments);},
//     HttpProxyConnectionType: {
//       "0": "Legacy",
//       "1": "Forwarding",
//       "2": "Tunneling",
//       Legacy: 0,
//       Forwarding: 1,
//       Tunneling: 2,
//     },
//     HttpClientConnection: function HttpClientConnection() {return mockConstructor.apply(this,arguments);},
//     HttpStream: function HttpStream() {return mockConstructor.apply(this,arguments);},
//     HttpClientStream: function HttpClientStream() {return mockConstructor.apply(this,arguments);},
//     HttpClientConnectionManager: function HttpClientConnectionManager() {return mockConstructor.apply(this,arguments);},
//     HttpProxyAuthenticationType: {
//       "0": "None",
//       "1": "Basic",
//       None: 0,
//       Basic: 1,
//     },
//     HttpProxyOptions: function HttpProxyOptions() {return mockConstructor.apply(this,arguments);},
//   },
//   io: {
//     __esModule: true,
//     error_code_to_string: function error$code$to$string() {return mockConstructor.apply(this,arguments);},
//     error_code_to_name: function error$code$to$name() {return mockConstructor.apply(this,arguments);},
//     LogLevel: {
//       "0": "NONE",
//       "1": "FATAL",
//       "2": "ERROR",
//       "3": "WARN",
//       "4": "INFO",
//       "5": "DEBUG",
//       "6": "TRACE",
//       NONE: 0,
//       FATAL: 1,
//       ERROR: 2,
//       WARN: 3,
//       INFO: 4,
//       DEBUG: 5,
//       TRACE: 6,
//     },
//     enable_logging: function enable$logging() {return mockConstructor.apply(this,arguments);},
//     is_alpn_available: function is$alpn$available() {return mockConstructor.apply(this,arguments);},
//     InputStream: function InputStream() {return mockConstructor.apply(this,arguments);},
//     ClientBootstrap: function ClientBootstrap() {return mockConstructor.apply(this,arguments);},
//     SocketOptions: function SocketOptions() {return mockConstructor.apply(this,arguments);},
//     TlsContextOptions: function TlsContextOptions() {return mockConstructor.apply(this,arguments);},
//     TlsContext: function TlsContext() {return mockConstructor.apply(this,arguments);},
//     ClientTlsContext: function ClientTlsContext() {return mockConstructor.apply(this,arguments);},
//     ServerTlsContext: function ServerTlsContext() {return mockConstructor.apply(this,arguments);},
//     TlsConnectionOptions: function TlsConnectionOptions() {return mockConstructor.apply(this,arguments);},
//     TlsVersion: {
//       "0": "SSLv3",
//       "1": "TLSv1",
//       "2": "TLSv1_1",
//       "3": "TLSv1_2",
//       "4": "TLSv1_3",
//       "128": "Default",
//       SSLv3: 0,
//       TLSv1: 1,
//       TLSv1_1: 2,
//       TLSv1_2: 3,
//       TLSv1_3: 4,
//       Default: 128,
//     },
//     SocketType: {
//       "0": "STREAM",
//       "1": "DGRAM",
//       STREAM: 0,
//       DGRAM: 1,
//     },
//     SocketDomain: {
//       "0": "IPV4",
//       "1": "IPV6",
//       "2": "LOCAL",
//       IPV4: 0,
//       IPV6: 1,
//       LOCAL: 2,
//     },
//   },
//   iot: {
//     __esModule: true,
//     AwsIotMqttConnectionConfigBuilder: function AwsIotMqttConnectionConfigBuilder() {return mockConstructor.apply(this,arguments);},
//   },
// }

const mockDev = jest.createMockFromModule("aws-iot-device-sdk-v2");

mockDev.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path = jest
  .fn()
  .mockReturnValue({
    with_certificate_authority_from_path: jest.fn(),
    with_client_id: jest.fn(),
    with_endpoint: jest.fn(),
    with_port: jest.fn(),
    with_ping_timeout_ms: jest.fn(),
    with_keep_alive_seconds: jest.fn(),
    with_clean_session: jest.fn(),
    with_http_proxy_options: jest.fn(),
    build: jest.fn().mockReturnValue("Built Configurations"),
  });

const onMock = jest.fn();
const pubMock = jest.fn();
const conMock = jest.fn();
const newConnMock = jest.fn().mockReturnValue({
  on: onMock,
  publish: pubMock,
  connect: conMock,
});

mockDev.mqtt.MqttClient = jest.fn().mockImplementation(() => {
  return {
    new_connection: newConnMock,
  };
});

module.exports = mockDev;
