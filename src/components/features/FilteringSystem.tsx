import React, { useState } from 'react';
import { Box, Select, Input, Button, VStack, HStack, FormLabel } from '@chakra-ui/react';

interface Filter {
  id: string;
  label: string;
  type: 'select' | 'date';
  options?: string[];
}

interface FilteringSystemProps {
  filters: Filter[];
  initialValues?: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
  onReset: () => void;
}

export const FilteringSystem: React.FC<FilteringSystemProps> = ({
  filters,
  initialValues = {},
  onChange,
  onReset,
}) => {
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const handleChange = (id: string, value: string) => {
    const newValues = { ...values, [id]: value };
    setValues(newValues);
    onChange(newValues);
  };

  const handleReset = () => {
    setValues({});
    onChange({});
    onReset();
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {filters.map(filter => (
          <Box key={filter.id}>
            <FormLabel htmlFor={filter.id}>{filter.label}</FormLabel>
            {filter.type === 'select' ? (
              <Select
                id={filter.id}
                value={values[filter.id] || ''}
                onChange={e => handleChange(filter.id, e.target.value)}
                aria-label={filter.label}
                title={filter.label}
              >
                <option value="">Select {filter.label}</option>
                {filter.options?.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={filter.id}
                type="date"
                value={values[filter.id] || ''}
                onChange={e => handleChange(filter.id, e.target.value)}
                aria-label={filter.label}
              />
            )}
          </Box>
        ))}
        <HStack>
          <Button onClick={handleReset}>Reset</Button>
        </HStack>
      </VStack>
    </Box>
  );
};
