import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Heading,
  Card,
  CardBody,
  useColorModeValue,
  FormErrorMessage,
  Radio,
  RadioGroup,
  VStack,
  Textarea,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { registerSchema, type RegisterFormData } from '@/lib/schemas/auth';

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orgType, setOrgType] = useState<'new' | 'existing' | 'invited'>('new');
  const inviteCode = typeof window !== 'undefined' ? sessionStorage.getItem('inviteCode') : null;

  useEffect(() => {
    if (inviteCode) {
      setOrgType('invited');
      setValue('organization.inviteCode', inviteCode);
    }
  }, [inviteCode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organization: {
        type: 'new',
      },
    },
  });

  const handleRegistration = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const fullName = data.middleName
        ? `${data.firstName} ${data.middleName} ${data.lastName}`
        : `${data.firstName} ${data.lastName}`;

      const userRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          phoneNumber: data.phoneNumber,
          address: data.address,
          occupation: data.occupation,
          dateOfBirth: data.dateOfBirth,
          memorableDates: data.memorableDates,
          organization: {
            name: data.organization.name,
            description: data.organization.description,
          },
        }),
      });

      if (!userRes.ok) {
        throw new Error('Registration failed');
      }

      if (data.organization.type === 'new' && data.organization.name) {
        const orgRes = await fetch('/api/organizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.organization.name,
            description: data.organization.description,
          }),
        });

        if (!orgRes.ok) {
          throw new Error('Organization creation failed');
        }
      }

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="md">
        <Card bg={useColorModeValue('white', 'gray.800')}>
          <CardBody>
            <Stack spacing={6}>
              <Stack spacing={2} textAlign="center">
                <Heading size="lg" color="pink.700">
                  Create an Account
                </Heading>
                <Text color="gray.600">Church Management System for Africa</Text>
              </Stack>

              <form onSubmit={handleSubmit(handleRegistration)}>
                <VStack spacing={4}>
                  <Stack direction={{ base: 'column', sm: 'row' }} spacing={2} w="full">
                    <FormControl isRequired isInvalid={!!errors.firstName}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        {...register('firstName')}
                        focusBorderColor="pink.400"
                        placeholder="John"
                      />
                      <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        {...register('lastName')}
                        focusBorderColor="pink.400"
                        placeholder="Doe"
                      />
                      <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>

                  <FormControl isInvalid={!!errors.middleName}>
                    <FormLabel>
                      Middle Name
                      <Text as="span" fontSize="sm" color="gray.500" ml={1}>
                        (Optional)
                      </Text>
                    </FormLabel>
                    <Input
                      {...register('middleName')}
                      focusBorderColor="pink.400"
                      placeholder="James"
                    />
                    <FormErrorMessage>{errors.middleName?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      {...register('email')}
                      focusBorderColor="pink.400"
                      placeholder="john.doe@example.com"
                    />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...register('password')} focusBorderColor="pink.400" />
                    <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Organization</FormLabel>
                    <RadioGroup
                      value={orgType}
                      onChange={(value: 'new' | 'existing' | 'invited') => setOrgType(value)}
                    >
                      <Stack>
                        <Radio value="new" colorScheme="pink">
                          Create new organization
                        </Radio>
                        <Radio value="existing" colorScheme="pink">
                          Join existing organization
                        </Radio>
                        {inviteCode && (
                          <Radio value="invited" colorScheme="pink">
                            Join via invitation
                          </Radio>
                        )}
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  {orgType === 'invited' && (
                    <FormControl>
                      <FormLabel>Invitation Code</FormLabel>
                      <Input
                        {...register('organization.inviteCode')}
                        defaultValue={inviteCode || undefined}
                        isReadOnly
                        focusBorderColor="pink.400"
                      />
                    </FormControl>
                  )}

                  {orgType === 'new' ? (
                    <>
                      <FormControl isInvalid={!!errors.organization?.name}>
                        <FormLabel>Organization Name</FormLabel>
                        <Input {...register('organization.name')} focusBorderColor="pink.400" />
                        <FormErrorMessage>{errors.organization?.name?.message}</FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Description (Optional)</FormLabel>
                        <Textarea
                          {...register('organization.description')}
                          focusBorderColor="pink.400"
                        />
                      </FormControl>
                    </>
                  ) : (
                    <FormControl>
                      <FormLabel>Organization ID</FormLabel>
                      <Input {...register('organization.id')} focusBorderColor="pink.400" />
                      <Text fontSize="sm" color="gray.500">
                        Ask your organization administrator for the ID
                      </Text>
                    </FormControl>
                  )}

                  <Button
                    type="submit"
                    colorScheme="pink"
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>

              <Text textAlign="center">
                Already have an account?{' '}
                <ChakraLink as={Link} href="/auth/signin" variant="auth">
                  Sign in
                </ChakraLink>
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
