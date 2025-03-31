import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  validation?: (value: string) => string | undefined;
}

interface CRUDFormProps {
  fields: Field[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  isEdit?: boolean;
}

export const CRUDForm: React.FC<CRUDFormProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  isEdit = false,
}) => {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.validation) {
        const error = field.validation(values[field.name] || '');
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast({
        title: isEdit ? 'Updated successfully' : 'Created successfully',
        status: 'success',
        duration: 3000,
      });
      if (!isEdit) {
        setValues({});
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" role="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {fields.map(field => (
          <FormControl key={field.name} isRequired={field.required}>
            <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              value={values[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              isInvalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
            {errors[field.name] && (
              <Box color="red.500" fontSize="sm" id={`${field.name}-error`}>
                {errors[field.name]}
              </Box>
            )}
          </FormControl>
        ))}
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting} loadingText="Submitting">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </VStack>
    </Box>
  );
};
