"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
} from "@chakra-ui/react";
import { registerSchema, type RegisterFormData } from "@/lib/schemas/auth";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orgType, setOrgType] = useState<"new" | "existing" | "invited">("new");
  const inviteCode =
    typeof window !== "undefined" ? sessionStorage.getItem("inviteCode") : null;

  useEffect(() => {
    if (inviteCode) {
      setOrgType("invited");
      setValue("organization.inviteCode", inviteCode);
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
        type: "new",
      },
    },
  });

  const handleRegistration = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // First create user
      const userRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!userRes.ok) {
        throw new Error("Registration failed");
      }

      // If new organization, create it
      if (data.organization.type === "new" && data.organization.name) {
        const orgRes = await fetch("/api/organizations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.organization.name,
            description: data.organization.description,
          }),
        });

        if (!orgRes.ok) {
          throw new Error("Organization creation failed");
        }
      }

      // Sign in the user
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="md">
        <Card bg={useColorModeValue("white", "gray.800")}>
          <CardBody>
            <Stack spacing={6}>
              <Stack spacing={2} textAlign="center">
                <Heading size="lg" color="purple.700">
                  Create an Account
                </Heading>
                <Text color="gray.600">
                  Church Management System for Africa
                </Text>
              </Stack>

              <form onSubmit={handleSubmit(handleRegistration)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Name</FormLabel>
                    <Input {...register("name")} />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" {...register("email")} />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...register("password")} />
                    <FormErrorMessage>
                      {errors.password?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Organization</FormLabel>
                    <RadioGroup
                      value={orgType}
                      onChange={(value: "new" | "existing" | "invited") =>
                        setOrgType(value)
                      }
                    >
                      <Stack>
                        <Radio value="new">Create new organization</Radio>
                        <Radio value="existing">
                          Join existing organization
                        </Radio>
                        {inviteCode && (
                          <Radio value="invited">Join via invitation</Radio>
                        )}
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  {orgType === "invited" && (
                    <FormControl>
                      <FormLabel>Invitation Code</FormLabel>
                      <Input
                        {...register("organization.inviteCode")}
                        defaultValue={inviteCode}
                        isReadOnly
                      />
                    </FormControl>
                  )}

                  {orgType === "new" ? (
                    <>
                      <FormControl isInvalid={!!errors.organization?.name}>
                        <FormLabel>Organization Name</FormLabel>
                        <Input {...register("organization.name")} />
                        <FormErrorMessage>
                          {errors.organization?.name?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Description (Optional)</FormLabel>
                        <Textarea {...register("organization.description")} />
                      </FormControl>
                    </>
                  ) : (
                    <FormControl>
                      <FormLabel>Organization ID</FormLabel>
                      <Input {...register("organization.id")} />
                      <Text fontSize="sm" color="gray.500">
                        Ask your organization administrator for the ID
                      </Text>
                    </FormControl>
                  )}

                  <Button
                    type="submit"
                    colorScheme="purple"
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>

              <Text textAlign="center">
                Already have an account?{" "}
                <Link href="/auth/signin" style={{ color: "#553C9A" }}>
                  Sign in
                </Link>
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
