import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/security';
import { validateRecaptcha } from '@/lib/recaptcha';
import { logger, trackError, trackEvent, performanceMonitor } from '@/lib/monitoring';

export async function POST(req: Request) {
  const endTimer = performanceMonitor.start('registration');
  
  try {
    // Track registration attempt
    trackEvent('registration_started');

    // Rate limiting
    const limiter = await rateLimit.check(req);
    if (!limiter.success) {
      trackEvent('registration_rate_limited');
      return new Response('Too many requests', { status: 429 });
    }

    const data = await req.json();
    const sanitizedData = sanitizeInput(data);
    
    // Validate reCAPTCHA
    const recaptchaValid = await validateRecaptcha(data.recaptchaToken);
    if (!recaptchaValid) {
      trackEvent('registration_recaptcha_failed');
      return new Response('Invalid reCAPTCHA', { status: 400 });
    }

    // Create user
    const user = await prisma.user.create({
      data: sanitizedData,
    });

    // Track successful registration
    trackEvent('registration_completed', {
      userId: user.id,
      hasOptionalFields: Boolean(user.socialMedia),
    });

    const duration = endTimer();
    logger.info({
      type: 'performance',
      action: 'registration',
      duration,
      userId: user.id,
    });

    return new Response(JSON.stringify({ success: true }));

  } catch (error) {
    trackError(error, { 
      context: 'registration',
      data: sanitizedData 
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Registration failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
      }),
      { status: 500 }
    );
  }
}
