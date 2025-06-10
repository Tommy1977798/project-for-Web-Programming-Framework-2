'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [books, setBooks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const fetchNotes = async () => {
    const res = await fetch(`/api/profile/${userId}`);
    const data = await res.json();
    setBooks(data.books || []);
    setNotes(data.notes || []);
    setLoading(false);
  };

  const handleEdit = (note: any) => {
    alert('Edit clicked for note: ' + note._id);
  };

  const handleDeleteNote = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this note?');
    if (!confirmDelete) return;
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    await fetchNotes();
  };

  const statusStats = Object.entries(
    books.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const categoryStats = Object.entries(
    books.flatMap(b => b.categories || []).reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const ratingStats = Object.entries(
    books.reduce((acc, b) => {
      const key = b.rating || 'unrated';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const tagStats = Object.entries(
    books.flatMap(b => b.tags || []).reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const timelineStats = books.filter(b => b.startDate && b.endDate).map(b => ({
    name: b.title,
    start: new Date(b.startDate).getTime(),
    end: new Date(b.endDate).getTime(),
    durationDays: Math.round((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24))
  }));

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌍 Public Profile</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📚 Shared Books</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {books.map((book) => (
            <div key={book._id} className="border p-2 rounded">
              <img src={book.thumbnail} alt={book.title} className="w-full mb-2" />
              <h3 className="font-bold text-sm">{book.title}</h3>
              <p className="text-xs text-gray-600">{(book.authors || []).join(', ')}</p>
              <p className="text-xs text-gray-400">Status: {book.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📊 Reading Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-sm mb-2">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                  {statusStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-2">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryStats}>
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value">
                  {categoryStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-2">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingStats}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value">
                  {ratingStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-2">Top Tags</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tagStats}>
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value">
                  {tagStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-medium text-sm mb-2">📆 Reading Duration Timeline (days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={timelineStats}>
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="durationDays">
                  {timelineStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📝 Shared Notes</h2>
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note._id} className="bg-gray-100 p-3 rounded">
              <p className="text-sm whitespace-pre-line">{note.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(note.updatedAt).toLocaleString()}
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <button onClick={() => handleEdit(note)} className="text-blue-600 text-sm">Edit</button>
                <button onClick={() => handleDeleteNote(note._id)} className="text-red-600 text-sm">Delete</button>

                <button
                  onClick={async () => {
                    await fetch(`/api/notes/${note._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ isPublic: !note.isPublic }),
                    });
                    await fetchNotes();
                  }}
                  className={`text-sm px-2 py-1 rounded ${
                    note.isPublic ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'
                  }`}
                >
                  {note.isPublic ? '取消公開' : '設為公開'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
