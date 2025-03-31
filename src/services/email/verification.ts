import { User } from '@prisma/client';
import { createVerificationUrl } from '@/services/auth/tokens';

export async function sendVerificationEmail(user: User, token: string) {
  const verificationUrl = createVerificationUrl(token);
  
  const emailContent = `
    Welcome to ${user.organization?.name}!
    
    Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create this account, please ignore this email.
    
    Best regards,
    Your Organization Team
  `;

  // TODO: Implement actual email sending logic
  // For now, just logging the email content
  console.log('Sending verification email to:', user.email);
  console.log('Email content:', emailContent);

  // You can implement your email service integration here
  // Example with a mail service:
  // await mailService.send({
  //   to: user.email,
  //   subject: 'Verify your email address',
  //   text: emailContent,
  // });
}