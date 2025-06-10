'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return (
    <div className="p-6 text-red-600 font-semibold">
      You are not logged in.
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-700">Your email: {user.email}</p>

      <div className="mt-6">
  <h3 className="text-sm font-medium mb-1">🔧 Customize Profile URL</h3>
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const slug = (form.slug as HTMLInputElement).value;

      const res = await fetch('/api/users/slug', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) alert('Slug updated!');
      else alert('Slug taken or error occurred.');
    }}
    className="flex gap-2"
  >
    <input
      type="text"
      name="slug"
      placeholder="your-name"
      className="border px-2 py-1 rounded"
      required
    />
    <button className="bg-blue-600 text-white px-3 py-1 rounded">Set</button>
  </form>
</div>


      {user && (
  <div className="mt-6 p-4 border rounded bg-white">
    <h2 className="text-lg font-semibold mb-2">🌐 Public Profile Link</h2>
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`/profile/${user._id}`}
        target="_blank"
        className="text-blue-600 underline break-all"
      >
        {`http://localhost:3000/profile/${user._id}`}
      </a>
      <button
        onClick={() => {
          navigator.clipboard.writeText(`http://localhost:3000/profile/${user._id}`);
          alert('Link copied to clipboard!');
        }}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Copy
      </button>
    </div>
  </div>
)}


    </div>
  );
}
