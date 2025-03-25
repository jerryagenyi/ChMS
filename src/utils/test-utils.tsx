import { ChakraProvider } from "@chakra-ui/react";
import { render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";

function render(ui: ReactElement, options = {}) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: ({ children }) => <ChakraProvider>{children}</ChakraProvider>,
      ...options,
    }),
  };
}

export * from "@testing-library/react";
export { render };
