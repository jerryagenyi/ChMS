import React from 'react';
import { FormControl, FormLabel, Select, FormErrorMessage, Skeleton } from '@chakra-ui/react';
import { useOrganizationTouchpoints } from '@/hooks/useOrganizationTouchpoints';

interface VisitorTouchpointSelectorProps {
  value: {
    touchpoint: string;
    source: string;
  };
  onChange: (value: { touchpoint: string; source: string }) => void;
  isRequired?: boolean;
  error?: string;
}

export function VisitorTouchpointSelector({
  value,
  onChange,
  isRequired = false,
  error,
}: VisitorTouchpointSelectorProps) {
  const { touchpoints, isLoading, isError } = useOrganizationTouchpoints();

  if (isLoading) {
    return (
      <FormControl isRequired={isRequired}>
        <FormLabel>How did you hear about us?</FormLabel>
        <Skeleton height="40px" />
      </FormControl>
    );
  }

  if (isError) {
    return (
      <FormControl isRequired={isRequired} isInvalid={!!error}>
        <FormLabel>How did you hear about us?</FormLabel>
        <Select isDisabled aria-label="How did you hear about us">
          <option>Error loading touchpoints</option>
        </Select>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );
  }

  const uniqueTypes = Array.from(new Set(touchpoints?.map(t => t.type) || []));

  const sourcesForType = touchpoints?.filter(t => t.type === value.touchpoint && t.isActive);

  return (
    <>
      <FormControl isRequired={isRequired} isInvalid={!!error} mb={4}>
        <FormLabel>How did you hear about us?</FormLabel>
        <Select
          value={value.touchpoint}
          onChange={e => onChange({ touchpoint: e.target.value, source: '' })}
          placeholder="Select type"
          aria-label="How did you hear about us"
        >
          {uniqueTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>

      {value.touchpoint && (
        <FormControl isRequired={isRequired} isInvalid={!!error}>
          <FormLabel>Please specify</FormLabel>
          <Select
            value={value.source}
            onChange={e => onChange({ ...value, source: e.target.value })}
            placeholder="Select source"
            aria-label="Please specify source"
          >
            {sourcesForType?.map(t => (
              <option key={t.id} value={t.source}>
                {t.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
      )}
    </>
  );
}
