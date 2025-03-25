import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

interface PasswordSetupProps {
  onSubmit: (password: string) => void;
}

export const PasswordSetup: React.FC<PasswordSetupProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      onSubmit(password);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <Button type="submit" mt={4}>Submit</Button>
    </Box>
  );
};