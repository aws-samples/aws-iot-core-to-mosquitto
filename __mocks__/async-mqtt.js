// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from "@jest/globals";
import events from "events";

/**
 * AsyncClient {
      publish: [Function: publish] {},
      subscribe: [Function: subscribe] {},
      unsubscribe: [Function: unsubscribe] {},
      end: [Function: end] {},
      reconnect: [Function: reconnect] {},
      addListener: [Function: addListener] {},
      emit: [Function: emit] {},
      eventNames: [Function: eventNames] {},
      getLastMessageId: [Function: getLastMessageId] {},
      getMaxListeners: [Function: getMaxListeners] {},
      listenerCount: [Function: listenerCount] {},
      listeners: [Function: listeners] {},
      off: [Function: off] {},
      on: [Function: on] {},
      once: [Function: once] {},
      prependListener: [Function: prependListener] {},
      prependOnceListener: [Function: prependOnceListener] {},
      rawListeners: [Function: rawListeners] {},
      removeAllListeners: [Function: removeAllListeners] {},
      removeListener: [Function: removeListener] {},
      removeOutgoingMessage: [Function: removeOutgoingMessage] {},
      setMaxListeners: [Function: setMaxListeners] {}
    }
 */

const mockAsyncMqtt = jest.createMockFromModule("async-mqtt");

const self = new events.EventEmitter();

let publishError = false;

const mockSub = jest.fn(() => {
  return "Subscribed";
});
const mockPub = jest.fn(() => {
  if (!publishError) {
    return "Published";
  }
  throw new Error("Not Published");
});

mockAsyncMqtt.AsyncClient = jest.fn().mockImplementation(() => {
  setTimeout(() => {
    self.emit("connect");
  }, 300);
  self.publish = mockPub;
  self.subscribe = mockSub;
  return self;
});

mockAsyncMqtt.setErrorOnPublish = (setError) => {
  publishError = setError;
};

export default mockAsyncMqtt;
