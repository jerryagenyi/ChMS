import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/auth-options';
import Providers from '@/components/providers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
