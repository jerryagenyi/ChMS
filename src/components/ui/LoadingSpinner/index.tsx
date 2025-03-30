"use client";

import { Spinner, Center } from "@chakra-ui/react";

export default function LoadingSpinner() {
  return (
    <Center minH="200px">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="primary.500"
        size="xl"
      />
    </Center>
  );
}
