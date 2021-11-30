/* eslint-disable no-prototype-builtins */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from "@jest/globals";

// const mockGot = jest.createMockFromModule("got");

function validateEndpoint(endpoint) {
  const urlExpression =
    // eslint-disable-next-line no-useless-escape
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const regex = new RegExp(urlExpression);
  return endpoint.match(regex);
}

function validateRequestOptions(reqOptions) {
  return (
    reqOptions.hasOwnProperty("method") &&
    ["POST", "GET"].includes(reqOptions.method) &&
    reqOptions.hasOwnProperty("headers") &&
    reqOptions.hasOwnProperty("body")
  );
}

let apiResponse = {
  body: '{ "Message": "Whatever" }',
  args: "Got Arguments Validated correctly",
};

let setErrorOnCall = false;

const mockGot = jest.fn().mockImplementation((endpoint, requestOptions) => {
  return new Promise((resolve, reject) => {
    if (endpoint && requestOptions) {
      if (validateEndpoint(endpoint)) {
        if (validateRequestOptions(requestOptions)) {
          if (!setErrorOnCall) {
            resolve(apiResponse);
          } else {
            reject(apiResponse);
          }
        } else {
          reject(new Error("Argument requestOptions is not correct"));
        }
      } else {
        reject(new Error("Argument Endpoint is not correct"));
      }
    } else {
      reject(new Error("Arguments are not correct"));
    }
  });
});

mockGot.setResponse = (response) => {
  apiResponse = response;
};

mockGot.setErrorOnCall = (setError) => {
  setErrorOnCall = setError;
};

export default mockGot;
