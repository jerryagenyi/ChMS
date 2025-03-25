import "@testing-library/jest-dom";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    checkIn: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    service: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));
