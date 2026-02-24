/**
 * Test Setup File
 * Configure environment and global test settings
 */

import { jest as jestGlobal } from "@jest/globals";

global.jest = jestGlobal;

// Set test environment
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";

// Suppress console output during tests
const originalLog = console.log;
const originalError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalLog;
  console.error = originalError;
});
