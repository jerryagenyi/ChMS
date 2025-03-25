import ImportUsers from '@/components/users/ImportUsers';
import { Box, Heading } from '@chakra-ui/react';

export default function ImportUsersPage() {
  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <Heading mb={6}>Import Users</Heading>
      <ImportUsers />
    </Box>
  );
}