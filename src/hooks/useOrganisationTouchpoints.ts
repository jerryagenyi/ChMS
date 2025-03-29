import useSWR from 'swr';
import { useSession } from 'next-auth/react';

interface OrganizationTouchpoint {
  id: string;
  type: string;
  source: string;
  label: string;
  isActive: boolean;
}

export function useOrganizationTouchpoints() {
  const { data: session } = useSession();
  const { data: touchpoints, error } = useSWR<OrganizationTouchpoint[]>(
    session?.user?.organizationId
      ? `/api/organizations/${session.user.organizationId}/touchpoints`
      : null
  );

  return {
    touchpoints,
    isLoading: !error && !touchpoints,
    isError: error,
  };
} 