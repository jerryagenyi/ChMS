'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { Organisation, OrganisationSettings } from '@prisma/client';
import { useRouter } from 'next/navigation';

const settingsSchema = z.object({
  // Brand Colours
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),

  // Localization
  language: z.enum(['en', 'es', 'fr', 'de', 'it']),
  currency: z.enum(['GBP', 'USD', 'EUR']),
  timezone: z.string(),

  // Additional Settings
  logoUrl: z.string().url().optional().or(z.literal('')),
  faviconUrl: z.string().url().optional().or(z.literal('')),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  organisation: Organisation & {
    settings: OrganisationSettings | null;
  };
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
];

const currencies = [
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

const timezones = [
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

export default function SettingsForm({ organisation }: SettingsFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: SettingsFormData = {
    primaryColor: organisation.settings?.primaryColor ?? '#000000',
    secondaryColor: organisation.settings?.secondaryColor ?? '#666666',
    backgroundColor: organisation.settings?.backgroundColor ?? '#FFFFFF',
    accentColor: organisation.settings?.accentColor ?? '#F5F5F5',
    language: (organisation.settings?.language as any) ?? 'en',
    currency: (organisation.settings?.currency as any) ?? 'GBP',
    timezone: organisation.settings?.timezone ?? 'Europe/London',
    logoUrl: organisation.settings?.logoUrl ?? '',
    faviconUrl: organisation.settings?.faviconUrl ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast({
        title: 'Settings updated',
        description: 'Your organization settings have been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={4}>
            Brand Colours
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isInvalid={!!errors.primaryColor}>
              <FormLabel>Primary Color</FormLabel>
              <Input type="color" {...register('primaryColor')} data-testid="primary-color-input" />
              <Text color="red.500" fontSize="sm" data-testid="primary-color-error">
                {errors.primaryColor?.message}
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.secondaryColor}>
              <FormLabel>Secondary Color</FormLabel>
              <Input
                type="color"
                {...register('secondaryColor')}
                data-testid="secondary-color-input"
              />
              <Text color="red.500" fontSize="sm">
                {errors.secondaryColor?.message}
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.backgroundColor}>
              <FormLabel>Background Color</FormLabel>
              <Input
                type="color"
                {...register('backgroundColor')}
                data-testid="background-color-input"
              />
              <Text color="red.500" fontSize="sm">
                {errors.backgroundColor?.message}
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.accentColor}>
              <FormLabel>Accent Color</FormLabel>
              <Input type="color" {...register('accentColor')} data-testid="accent-color-input" />
              <Text color="red.500" fontSize="sm">
                {errors.accentColor?.message}
              </Text>
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Localization
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <FormControl isInvalid={!!errors.language}>
              <FormLabel>Language</FormLabel>
              <Select {...register('language')} data-testid="language-select">
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </Select>
              <Text color="red.500" fontSize="sm">
                {errors.language?.message}
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.currency}>
              <FormLabel>Currency</FormLabel>
              <Select {...register('currency')} data-testid="currency-select">
                {currencies.map(curr => (
                  <option key={curr.value} value={curr.value}>
                    {curr.label}
                  </option>
                ))}
              </Select>
              <Text color="red.500" fontSize="sm">
                {errors.currency?.message}
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.timezone}>
              <FormLabel>Timezone</FormLabel>
              <Select {...register('timezone')} data-testid="timezone-select">
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </Select>
              <Text color="red.500" fontSize="sm">
                {errors.timezone?.message}
              </Text>
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Brand Assets
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isInvalid={!!errors.logoUrl}>
              <FormLabel>Logo URL</FormLabel>
              <Input type="url" {...register('logoUrl')} data-testid="logo-url-input" />
              <Text color="red.500" fontSize="sm">
                {errors.logoUrl?.message}
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.faviconUrl}>
              <FormLabel>Favicon URL</FormLabel>
              <Input type="url" {...register('faviconUrl')} data-testid="favicon-url-input" />
              <Text color="red.500" fontSize="sm">
                {errors.faviconUrl?.message}
              </Text>
            </FormControl>
          </SimpleGrid>
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          data-testid="save-settings-button"
        >
          Save Settings
        </Button>
      </VStack>
    </Box>
  );
}
