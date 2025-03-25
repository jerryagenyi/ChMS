"use client";

import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "./ChakraProvider";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>{children}</ChakraProvider>
    </SessionProvider>
  );
}
