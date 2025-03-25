import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas/auth";
import { trackEvent } from "@/lib/monitoring";
import { useToast } from "@chakra-ui/react";

export const RegisterForm = () => {
  // Progressive enhancement
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setIsClient(true), []);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    trackEvent("registration_form_submitted");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Registration failed");

      trackEvent("registration_form_success");

      // Optimistic UI update
      toast({
        title: "Welcome aboard! 🎉",
        description: "Your account has been created successfully.",
        status: "success",
      });
    } catch (error) {
      trackEvent("registration_form_error", { error: error.message });

      toast({
        title: "Registration failed",
        description: "Please try again later.",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Server-side fallback
  if (!isClient) {
    return (
      <form action="/api/auth/register" method="POST">
        {/* Basic form fields without JS */}
        <noscript>
          <p className="text-yellow-600">
            Enable JavaScript for a better experience.
          </p>
        </noscript>
      </form>
    );
  }

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Enhanced form fields */}
      <FormField label="Name" error={form.formState.errors.name} required>
        <Input
          {...form.register("name")}
          aria-describedby="name-error"
          disabled={isSubmitting}
        />
      </FormField>

      {/* Social Media Section */}
      <FormSection title="Social Media (Optional)">
        <FormField label="TikTok">
          <Input
            {...form.register("socialMedia.tiktok")}
            placeholder="https://tiktok.com/@username"
            disabled={isSubmitting}
          />
        </FormField>
        {/* Other social media fields */}
      </FormSection>

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Creating account..."
      >
        Create Account
      </Button>
    </Form>
  );
};
