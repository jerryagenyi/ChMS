import { Box, Button, Container, Heading, VStack, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AttendanceList } from '@/components/attendance/AttendanceList';
import { QRCodeGenerator } from '@/components/attendance/QRCodeGenerator';
import { QRScanner } from '@/components/attendance/QRScanner';
import { useSession } from 'next-auth/react';

interface AttendancePageProps {
  params: {
    classId: string;
  };
}

export default function AttendancePage({ params }: AttendancePageProps) {
  const { classId } = params;
  const { data: session } = useSession();
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!session?.user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access this page',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [session, toast]);

  if (!session?.user) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg">Class Attendance</Heading>
          <Box>
            <Button colorScheme="blue" mr={4} onClick={() => setShowQRGenerator(true)}>
              Generate QR Code
            </Button>
            <Button colorScheme="green" onClick={() => setShowQRScanner(true)}>
              Scan QR Code
            </Button>
          </Box>
        </Box>

        <AttendanceList classId={classId} />

        {showQRGenerator && (
          <QRCodeGenerator classId={classId} onClose={() => setShowQRGenerator(false)} />
        )}

        {showQRScanner && <QRScanner onClose={() => setShowQRScanner(false)} />}
      </VStack>
    </Container>
  );
}
