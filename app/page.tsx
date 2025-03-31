import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to ChMS</h1>
      <Link href="/auth/signin">Sign In</Link>
    </div>
  );
}
