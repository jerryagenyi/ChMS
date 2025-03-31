import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useDataSync } from '@/hooks/useDataSync';

interface DataSyncProps {
  maxRetries?: number;
  onConflict?: (localData: any, serverData: any) => void;
}

export const DataSync: React.FC<DataSyncProps> = ({ maxRetries = 3, onConflict }) => {
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictData, setConflictData] = useState<{
    local: any;
    server: any;
  } | null>(null);
  const toast = useToast();

  const { sync, isSyncing, error } = useDataSync({
    maxRetries,
    onConflict: (local, server) => {
      setConflictData({ local, server });
      setIsConflictModalOpen(true);
      onConflict?.(local, server);
    },
  });

  useEffect(() => {
    const handleOnline = () => {
      sync();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [sync]);

  const handleConflictResolution = async (keepLocal: boolean) => {
    try {
      await sync(keepLocal ? 'local' : 'server');
      setIsConflictModalOpen(false);
      setConflictData(null);
      toast({
        title: 'Sync complete',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Sync failed',
        description: (err as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <Button
        onClick={() => sync()}
        isLoading={isSyncing}
        loadingText="Syncing..."
        colorScheme="brand"
      >
        Sync Now
      </Button>

      {error && (
        <Text color="red.500" mt={2}>
          {error.message}
        </Text>
      )}

      <Modal isOpen={isConflictModalOpen} onClose={() => setIsConflictModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Conflict Detected</ModalHeader>
          <ModalBody>
            <Text>
              There are conflicting changes between your local data and the server. Which version
              would you like to keep?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => handleConflictResolution(false)}>
              Keep Server Version
            </Button>
            <Button colorScheme="brand" onClick={() => handleConflictResolution(true)}>
              Keep Local
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
