import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { rateLimiter } from '@/services/auth/rate-limit';
import { sanitizeInput } from '@/services/security/input-sanitizer';
import { validateRecaptcha } from '@/services/security/recaptcha';
import { logger, trackError, trackEvent, performanceMonitor } from '@/lib/monitoring';
import { generateVerificationToken } from '@/services/auth/tokens';
import { sendVerificationEmail } from '@/services/email/verification';

// Define a type for your sanitized data
interface SanitizedData {
    name: string;      // Required
    email: string;     // Required
    password: string;  // Required
    dateOfBirth?: Date;
    memorableDates?: {
        weddingAnniversary?: Date;
        baptismDate?: Date;
        conversionDate?: Date;
    };
    organization?: {
        name?: string;
        description?: string;
    };
}

export async function POST(req: Request) {
  const endTimer = performanceMonitor.start('registration');
  let sanitizedData: SanitizedData = {
    name: "",
    email: "",
    password: "",
  }; // Declare outside try block
  
  try {
    // Track registration attempt
    trackEvent('registration_started');

    // Rate limiting
    const limiter = await rateLimiter.check(req);
    if (!limiter.success) {
      trackEvent('registration_rate_limited');
      return new Response('Too many requests', { status: 429 });
    }

    const data = await req.json();
    sanitizedData = sanitizeInput(data); // Assign inside try block
    
    // Validate reCAPTCHA
    const recaptchaValid = await validateRecaptcha(data.recaptchaToken);
    if (!recaptchaValid) {
      trackEvent('registration_recaptcha_failed');
      return new Response('Invalid reCAPTCHA', { status: 400 });
    }

    const verificationToken = generateVerificationToken();
    
    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        password: await hash(sanitizedData.password, 12),
        verificationToken,
        emailVerified: null,
        dateOfBirth: sanitizedData.dateOfBirth,
        memorableDates: sanitizedData.memorableDates,
        organization: sanitizedData.organization?.description ? {
          create: {
            name: sanitizedData.name, // or get organization name from sanitizedData
            description: sanitizedData.organization.description
          }
        } : undefined,
      },
    });

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    // Track successful registration
    trackEvent('registration_completed', {
      userId: user.id,
      hasOptionalFields: Boolean(
        sanitizedData.dateOfBirth || 
        sanitizedData.memorableDates || 
        sanitizedData.organization?.description
      ),
      requiresVerification: true
    });

    const duration = endTimer();
    logger.info({
      type: 'performance',
      action: 'registration',
      duration,
      userId: user.id,
    });

    return new Response(JSON.stringify({ 
      success: true,
      requiresVerification: true
    }));

  } catch (error) {
    trackError(error instanceof Error ? error : new Error('Unknown error'), { 
      context: 'registration',
      data: sanitizedData 
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Registration failed',
        message: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error') 
          : 'An error occurred'
      }),
      { status: 500 }
    );
  }
}
