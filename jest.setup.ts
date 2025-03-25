import "@testing-library/jest-dom";

// Polyfills
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock Response, Request, and Headers for MSW
const { Response, Request, Headers } = require("node-fetch");
global.Response = Response;
global.Request = Request;
global.Headers = Headers;

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Suppress console errors during tests
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Suppress punycode deprecation warning
process.emitWarning = function(warning) {
  if (warning.includes('punycode')) return;
  return process.emit.apply(process, arguments);
};

// Mock next/auth
jest.mock("next-auth", () => ({
  ...jest.requireActual("next-auth"),
  getServerSession: jest.fn(),
}));

// Mock lib/organization
jest.mock("@/lib/organization", () => ({
  createOrganization: jest.fn(),
  addUserToOrganization: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));
