import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { ReactElement } from "react";
import React from "react";

export const mockSession = {
  user: {
    id: "user1",
    name: "Test User",
    email: "test@example.com",
    role: "MEMBER",
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
};

export const renderWithProviders = (ui: ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      <ChakraProvider>{ui}</ChakraProvider>
    </SessionProvider>
  );
};
