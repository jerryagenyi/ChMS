import { FormControl, FormLabel, FormErrorMessage, Input, InputProps } from '@chakra-ui/react';

interface FormInputProps extends Omit<InputProps, 'name'> {
  name: string;
  label: string;
  error?: string;
}

export const FormInput = ({ name, label, error, ...props }: FormInputProps) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        name={name}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <FormErrorMessage id={`${name}-error`}>{error}</FormErrorMessage>
      )}
    </FormControl>
  );
};