// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from "@jest/globals";
import events from "events";

const mockMqtt = jest.createMockFromModule("mqtt");

const mockSub = jest.fn();
const mockPub = jest.fn();
const self = new events.EventEmitter();
mockMqtt.connect = jest.fn().mockImplementation(() => {
  //   self.as = jest.fn().mockImplementation(() => {
  //     return self;
  //   });
  //   self.post = jest.fn().mockImplementation((eventName, callbackFunction) => {
  //     console.log(`event called: ${eventName}`);
  //     callbackFunction(null, { data: "connected to mosquitto broker" });
  //   });
  self.subscribe = mockSub;
  self.publish = mockPub;

  setTimeout(() => {
    self.emit("connect");
  }, 500);
  return self;
});

export default mockMqtt;
