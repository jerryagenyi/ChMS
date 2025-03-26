import React from "react";
import { render, act } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Session } from "next-auth";

// Extend the default Session type to include our custom fields
interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
}

export const mockSession: CustomSession = {
  user: {
    id: "1",
    email: "test@example.com",
    name: "Test User",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export function renderWithProviders(component: React.ReactElement) {
  return render(<ChakraProvider>{component}</ChakraProvider>);
}

export const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

interface MockService {
  id: string;
  name: string;
  startTime: Date;
  status: "ACTIVE" | "INACTIVE";
}

export const mockServices: MockService[] = [
  {
    id: "1",
    name: "Sunday Service",
    startTime: new Date(),
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Wednesday Service",
    startTime: new Date(),
    status: "ACTIVE",
  },
];
