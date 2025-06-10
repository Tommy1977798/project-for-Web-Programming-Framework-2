'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="p-6">Loading...</div>;
  }

  const user = session?.user;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        {user?.image && (
          <img src={user.image} alt="Avatar" className="w-24 h-24 rounded-full mt-4" />
        )}
      </div>
    </div>
  );
}
