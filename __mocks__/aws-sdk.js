// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from "@jest/globals";

const mockAwsSdk = jest.createMockFromModule("aws-sdk");

const s3Promise = {
  shouldResolve: true,
  set s3PromiseResolve(resolve) {
    this.shouldResolve = resolve;
  },
};
const mockConfig = jest.fn();

const s3PutPromise = jest.fn(() => {
  return new Promise((resolve, reject) => {
    if (s3Promise.shouldResolve) {
      setTimeout(resolve("Object added to S3 bucket"), 300);
    } else {
      setTimeout(reject(new Error("Error adding object to S3 bucket)"), 300));
    }
  });
});

const awsS3MockFn = jest.fn().mockImplementation(() => {
  return {
    putObject: jest.fn().mockReturnThis(),
    promise: s3PutPromise,
  };
});

mockAwsSdk.S3 = awsS3MockFn;
mockAwsSdk.s3Promise = s3Promise;

Object.defineProperty(mockAwsSdk.config, "s3", {
  set: mockConfig,
});

mockAwsSdk.mockConfig = mockConfig;

export default mockAwsSdk;
