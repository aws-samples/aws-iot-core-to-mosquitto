// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from "@jest/globals";
import { apiEndpoint } from "../src/env";

const dns = jest.createMockFromModule("dns");

const mockDnsLookUp = jest.fn();
dns.promises = { lookup: jest.fn() };

let mockedDNSEndpoints = {
  "s3.us-east-1.amazonaws.com": {
    address: "52.216.144.157",
    family: 4,
  },
};
const apiEndpointURL = apiEndpoint.split("/")[2];
mockedDNSEndpoints[apiEndpointURL] = {
  address: "XXX.XXX.XXX.XXX",
  family: 4,
};

mockDnsLookUp.mockImplementation(async (dnsAdress) => {
  if (dnsAdress in mockedDNSEndpoints) {
    return mockedDNSEndpoints[dnsAdress];
  }
  throw new Error("DNS Address Not found");
});

dns.promises.lookup = mockDnsLookUp;

dns.setErrorOnDnsLookUp = () => {
  mockedDNSEndpoints = {};
};

export default dns;
