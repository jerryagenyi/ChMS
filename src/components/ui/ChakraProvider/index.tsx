"use client";

import { ChakraProvider as Chakra, extendTheme } from "@chakra-ui/react";
import { themeConfig } from "@/lib/theme";

const theme = extendTheme(themeConfig);

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return <Chakra theme={theme}>{children}</Chakra>;
}