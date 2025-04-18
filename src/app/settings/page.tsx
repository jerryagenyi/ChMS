import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/services/auth-options';
import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/settings/SettingsForm';

export const metadata: Metadata = {
  title: 'Organization Settings | ChMS',
  description: "Customize your organization's appearance and preferences",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const organization = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
    include: { settings: true },
  });

  if (!organization) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>
      <SettingsForm organization={organization} />
    </div>
  );
}
