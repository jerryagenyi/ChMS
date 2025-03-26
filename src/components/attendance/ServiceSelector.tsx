"use client";

import {
  Box,
  Button,
  SimpleGrid,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

interface Service {
  id: string;
  name: string;
  startTime: string;
  status: "ACTIVE" | "SCHEDULED" | "COMPLETED";
}

interface ServiceSelectorProps {
  services: Service[];
  onSelect: (service: Service) => void;
  selectedId?: string;
}

// eslint-disable-next-line jsx-a11y/no-redundant-roles
export default function ServiceSelector({
  services,
  onSelect,
  selectedId,
}: ServiceSelectorProps) {
  const cardBg = useColorModeValue("white", "gray.700");
  const selectedBg = useColorModeValue("blue.50", "blue.900");

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={4}
      role="group"
      aria-label="Available services"
    >
      {services.map((service) => {
        const isSelected = service.id === selectedId;
        const isActive = service.status === "ACTIVE";

        return (
          <Button
            key={service.id}
            onClick={() => onSelect(service)}
            disabled={!isActive}
            variant="outline"
            height="auto"
            p={4}
            bg={isSelected ? selectedBg : cardBg}
            _hover={{
              bg: isSelected
                ? selectedBg
                : useColorModeValue("gray.50", "gray.600"),
            }}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            width="100%"
            aria-selected={isSelected}
            aria-disabled={!isActive}
            role="option"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {service.name}
            </Text>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {service.startTime}
            </Text>
            <Badge
              colorScheme={
                service.status === "ACTIVE"
                  ? "green"
                  : service.status === "SCHEDULED"
                  ? "yellow"
                  : "gray"
              }
            >
              {service.status}
            </Badge>
          </Button>
        );
      })}
    </SimpleGrid>
  );
}
