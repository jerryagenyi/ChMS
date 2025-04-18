import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/auth-options';
import { redirect } from 'next/navigation';
import SignInForm from './SignInForm';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return <SignInForm />;
}
