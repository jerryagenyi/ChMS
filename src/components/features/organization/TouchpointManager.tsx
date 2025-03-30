import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useToast,
  Switch,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { TOUCHPOINT_TYPES, TOUCHPOINT_SOURCES, TOUCHPOINT_LABELS } from '@/constants/touchpoints';
import useSWR from 'swr';

interface TouchpointManagerProps {
  organizationId: string;
}

interface Touchpoint {
  id: string;
  type: string;
  source: string;
  label: string;
  isActive: boolean;
}

export function TouchpointManager({ organizationId }: TouchpointManagerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [editingTouchpoint, setEditingTouchpoint] = useState<Touchpoint | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    source: '',
    label: '',
  });

  const { data: touchpoints, mutate } = useSWR<Touchpoint[]>(
    `/api/organizations/${organizationId}/touchpoints`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/organizations/${organizationId}/touchpoints`, {
        method: editingTouchpoint ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingTouchpoint ? { id: editingTouchpoint.id, ...formData } : formData
        ),
      });

      if (!response.ok) throw new Error('Failed to save touchpoint');

      toast({
        title: 'Success',
        description: `Touchpoint ${editingTouchpoint ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });

      mutate();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save touchpoint',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this touchpoint?')) return;

    try {
      const response = await fetch(`/api/organizations/${organizationId}/touchpoints`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete touchpoint');

      toast({
        title: 'Success',
        description: 'Touchpoint deleted successfully',
        status: 'success',
        duration: 3000,
      });

      mutate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete touchpoint',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (touchpoint: Touchpoint) => {
    setEditingTouchpoint(touchpoint);
    setFormData({
      type: touchpoint.type,
      source: touchpoint.source,
      label: touchpoint.label,
    });
    onOpen();
  };

  const resetForm = () => {
    setFormData({ type: '', source: '', label: '' });
    setEditingTouchpoint(null);
  };

  return (
    <Box>
      <Button onClick={onOpen} mb={4}>
        Add Touchpoint
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Source</Th>
            <Th>Label</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {touchpoints?.map(touchpoint => (
            <Tr key={touchpoint.id}>
              <Td>{TOUCHPOINT_LABELS[touchpoint.type as keyof typeof TOUCHPOINT_LABELS]}</Td>
              <Td>{touchpoint.source}</Td>
              <Td>{touchpoint.label}</Td>
              <Td>
                <Switch
                  isChecked={touchpoint.isActive}
                  onChange={async () => {
                    try {
                      const response = await fetch(
                        `/api/organizations/${organizationId}/touchpoints`,
                        {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            id: touchpoint.id,
                            isActive: !touchpoint.isActive,
                          }),
                        }
                      );

                      if (!response.ok) throw new Error('Failed to update touchpoint');

                      mutate();
                    } catch (error) {
                      toast({
                        title: 'Error',
                        description: 'Failed to update touchpoint',
                        status: 'error',
                        duration: 3000,
                      });
                    }
                  }}
                />
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit touchpoint"
                    icon={<EditIcon />}
                    onClick={() => handleEdit(touchpoint)}
                    size="sm"
                  />
                  <IconButton
                    aria-label="Delete touchpoint"
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(touchpoint.id)}
                    size="sm"
                    colorScheme="red"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{editingTouchpoint ? 'Edit Touchpoint' : 'Add Touchpoint'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">Select type</option>
                  {Object.entries(TOUCHPOINT_TYPES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {TOUCHPOINT_LABELS[value]}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Source</FormLabel>
                <Select
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="">Select source</option>
                  {Object.entries(TOUCHPOINT_SOURCES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Display Label</FormLabel>
                <Input
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Enter display label"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                {editingTouchpoint ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
