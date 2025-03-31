import PasswordSetup from '@/components/features/auth/PasswordSetup';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PasswordSetup />
      {children}
    </div>
  );
}
