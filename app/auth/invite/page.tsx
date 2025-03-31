'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams?.get('code');

  useEffect(() => {
    // Store invite code in session storage
    if (inviteCode) {
      sessionStorage.setItem('inviteCode', inviteCode);
      router.push('/auth/register');
    }
  }, [inviteCode, router]);

  return <div>Validating invitation...</div>;
}
