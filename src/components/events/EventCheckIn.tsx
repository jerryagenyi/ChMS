import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  HStack,
} from '@chakra-ui/react';
import { QRScanner } from '../QRScanner';

interface EventCheckInProps {
  eventId: string;
  onCheckIn: (registrationId: string) => Promise<void>;
}

export const EventCheckIn = ({ eventId, onCheckIn }: EventCheckInProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const toast = useToast();

  const handleManualCheckIn = async () => {
    if (!searchTerm) return;

    try {
      setIsLoading(true);
      await onCheckIn(searchTerm);
      toast({
        title: 'Check-in successful',
        status: 'success',
      });
      setSearchTerm('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRCodeScanned = async (data: string) => {
    try {
      await onCheckIn(data);
      toast({
        title: 'Check-in successful',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
      });
    }
  };

  return (
    <Box>
      <VStack spacing={6}>
        <Box width="100%">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Manual Check-in
          </Text>
          <HStack>
            <FormControl>
              <FormLabel>Registration ID or Email</FormLabel>
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Enter registration ID or email"
              />
            </FormControl>
            <Button colorScheme="blue" isLoading={isLoading} onClick={handleManualCheckIn} mt={8}>
              Check In
            </Button>
          </HStack>
        </Box>

        <Box width="100%">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            QR Code Check-in
          </Text>
          <Button colorScheme="blue" onClick={() => setIsScanning(!isScanning)} mb={4}>
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </Button>

          {isScanning && (
            <Box mt={4}>
              <QRScanner onScan={handleQRCodeScanned} />
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};
