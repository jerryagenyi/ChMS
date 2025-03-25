import PasswordSetup from "@/components/PasswordSetup";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PasswordSetup />
      {children}
    </div>
  );
}
