// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from "@jest/globals";

// const trueDynamoose = jest.requireActual("dynamoose");

// const dynamoose = { ...trueDynamoose };
const dynamoose = jest.createMockFromModule("dynamoose");

dynamoose.Schema = jest.fn().mockImplementation((schema) => {
  return schema;
});

let execResponse = null;

let mExec = jest.fn().mockResolvedValue(execResponse);

const mockQuery = jest.fn().mockImplementation(() => {
  return {
    eq: jest.fn().mockReturnThis(),
    exec: mExec,
    attributes: jest.fn().mockReturnThis(),
  };
});

const mockScan = jest.fn().mockImplementation(() => {
  return {
    exec: jest.fn().mockResolvedValue(execResponse),
  };
});

const mUpdate = jest.fn();
const mGet = jest.fn();
const mBatchPut = jest.fn();

dynamoose.model = jest.fn().mockImplementation((name, schema, options) => {
  return {
    name,
    schema,
    options,
    scan: mockScan,
    query: mockQuery,
    get: mGet,
    update: mUpdate,
    batchPut: mBatchPut,
  };
});

function setExecResponse(data) {
  execResponse = data;
  mExec = jest.fn().mockResolvedValue(execResponse);
}

function setExecChainedResponses(...args) {
  let mockFunctionHandler = jest.fn();
  for (let i = 0; i < args.length; i += 1) {
    mockFunctionHandler = mockFunctionHandler.mockResolvedValueOnce(args[i]);
  }
  mExec = mockFunctionHandler;
}

function setErrorOnUpdate() {
  mUpdate.mockRejectedValue(new Error("Error on Udate Dynamo"));
}

function setErrorOnExec() {
  mExec.mockRejectedValue(new Error("Error on Exec Dynamo"));
}
function setErrorOnGet() {
  mGet.mockRejectedValue(new Error("Error on Get Dynamo"));
}

function setUpdateResponse(data) {
  mUpdate.mockResolvedValue(data);
}

function setGetResponse(data) {
  mGet.mockResolvedValue(data);
}

dynamoose.setErrorOnUpdate = setErrorOnUpdate;
dynamoose.setQueryResponse = setExecResponse;
dynamoose.setScanResponse = setExecResponse;
dynamoose.setErrorOnScan = setErrorOnExec;
dynamoose.setErrorOnQuery = setErrorOnExec;
dynamoose.setErrorOnExec = setErrorOnExec;
dynamoose.setGetResponse = setGetResponse;
dynamoose.setErrorOnGet = setErrorOnGet;
dynamoose.setUpdateResponse = setUpdateResponse;
dynamoose.setExecChainedResponses = setExecChainedResponses;

dynamoose.aws.sdk.DynamoDB = jest.fn();

export default dynamoose;
