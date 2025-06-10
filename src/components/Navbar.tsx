'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const userId = email ? btoa(email) : null; // fallback 編碼 email 模擬 id

  return (
    <nav className="w-full bg-white border-b shadow-sm mb-6 p-4 flex gap-6 text-blue-600 font-semibold">
      <Link href="/dashboard">🏠 Dashboard</Link>
      <Link href="/books">📚 Books</Link>
      <Link href="/notes">📝 Notes</Link>
      <Link href={userId ? `/me` : '/login'}>👤 My Page</Link>
    </nav>
  );
}
