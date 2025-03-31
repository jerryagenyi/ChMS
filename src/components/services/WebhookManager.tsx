import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Checkbox,
  useToast,
  Text,
  HStack,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { RiRefreshLine, RiLockLine, RiDeleteBinLine } from 'react-icons/ri';
import { useWebhookStore, Webhook } from '@/store/webhooks';

const AVAILABLE_EVENTS = [
  'member.created',
  'member.updated',
  'member.deleted',
  'attendance.recorded',
  'event.created',
  'event.updated',
];

export const WebhookManager: React.FC = () => {
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { webhooks, addWebhook, removeWebhook, updateWebhook } = useWebhookStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          events: selectedEvents,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register webhook');
      }

      const webhook = await response.json();
      addWebhook(webhook);
      setUrl('');
      setSelectedEvents([]);
      toast({
        title: 'Webhook registered successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to register webhook',
        description: (err as Error).message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestWebhook = async (webhook: Webhook) => {
    try {
      const response = await fetch(`/api/webhooks/${webhook.id}/test`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Webhook test failed');
      }

      toast({
        title: 'Webhook test successful',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Webhook test failed',
        description: (err as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleGenerateSecret = async (webhook: Webhook) => {
    try {
      const response = await fetch(`/api/webhooks/${webhook.id}/secret`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate secret');
      }

      const { signature } = await response.json();
      updateWebhook(webhook.id, { secret: signature });
      toast({
        title: 'Secret generated successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to generate secret',
        description: (err as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDelete = async (webhook: Webhook) => {
    try {
      const response = await fetch(`/api/webhooks/${webhook.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete webhook');
      }

      removeWebhook(webhook.id);
      toast({
        title: 'Webhook deleted successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to delete webhook',
        description: (err as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Webhook URL</FormLabel>
            <Input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://your-server.com/webhook"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Events</FormLabel>
            <VStack align="start">
              {AVAILABLE_EVENTS.map(event => (
                <Checkbox
                  key={event}
                  isChecked={selectedEvents.includes(event)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedEvents([...selectedEvents, event]);
                    } else {
                      setSelectedEvents(selectedEvents.filter(ev => ev !== event));
                    }
                  }}
                >
                  {event}
                </Checkbox>
              ))}
            </VStack>
          </FormControl>

          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isSubmitting}
            loadingText="Registering..."
          >
            Register Webhook
          </Button>
        </VStack>
      </form>

      <VStack mt={8} spacing={4} align="stretch">
        {webhooks.map(webhook => (
          <Box key={webhook.id} p={4} borderWidth={1} borderRadius="md" position="relative">
            <HStack justify="space-between">
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">{webhook.url}</Text>
                <HStack wrap="wrap">
                  {webhook.events.map(event => (
                    <Badge key={event} colorScheme="brand">
                      {event}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
              <HStack>
                <IconButton
                  aria-label="Test webhook"
                  icon={RiRefreshLine as any}
                  onClick={() => handleTestWebhook(webhook)}
                  size="sm"
                />
                <IconButton
                  aria-label="Generate secret"
                  icon={RiLockLine as any}
                  onClick={() => handleGenerateSecret(webhook)}
                  size="sm"
                />
                <IconButton
                  aria-label="Delete webhook"
                  icon={RiDeleteBinLine as any}
                  onClick={() => handleDelete(webhook)}
                  colorScheme="red"
                  size="sm"
                />
              </HStack>
            </HStack>
            {webhook.secret && (
              <Text mt={2} fontSize="sm" color="gray.600">
                Secret: {webhook.secret}
              </Text>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
