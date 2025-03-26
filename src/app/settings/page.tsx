import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/settings/SettingsForm";

export const metadata: Metadata = {
  title: "Organization Settings | ChMS",
  description: "Customize your organization's appearance and preferences",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const organisation = await prisma.organisation.findUnique({
    where: { id: session.user.organisationId },
    include: { settings: true },
  });

  if (!organisation) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>
      <SettingsForm organisation={organisation} />
    </div>
  );
}
