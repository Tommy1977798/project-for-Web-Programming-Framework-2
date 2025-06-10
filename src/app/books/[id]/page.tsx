'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // === Book Loading ===
  useEffect(() => {
    if (!id) return;

    fetch(`/api/books/${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject('Failed to load book'))
      .then((data) => {
        setBook(data);
        setForm({
          status: data.status || 'wishlist',
          rating: data.rating || '',
          tags: data.tags?.join(', ') || '',
          startDate: data.startDate?.slice(0, 10) || '',
          endDate: data.endDate?.slice(0, 10) || '',
        });
      });

    fetchNotes();
  }, [id]);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data.filter((n: any) => n.bookId === id));
  };

  // === Book Update ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updates = {
      ...form,
      tags: form.tags.split(',').map((t: string) => t.trim()),
    };
    await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    alert('✅ Book updated!');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    router.push('/books');
  };

  // === Notes ===
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote) {
      await fetch(`/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });
    } else {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: id, content: newNote }),
      });
    }
    setNewNote('');
    setEditingNote(null);
    await fetchNotes();
  };

  const handleEdit = (note: any) => {
    setNewNote(note.content);
    setEditingNote(note);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Delete this note?')) return;
    await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    await fetchNotes();
  };

  if (!book) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      <p className="text-sm text-gray-600 mb-4">{(book.authors || []).join(', ')}</p>
      <img src={book.thumbnail} alt={book.title} className="mb-4 w-40" />

      {/* Book edit form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        {/* status, rating, tags, dates as before... */}
        <div>
          <label>Status:</label>
          <select className="w-full p-2 border" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="wishlist">Wishlist</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
        <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="w-full p-2 border" placeholder="Rating (1-5)" />
        <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full p-2 border" placeholder="Tags (comma separated)" />
        <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full p-2 border" />
        <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full p-2 border" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>

      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete Book</button>

      <button
  onClick={async () => {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: !book.isPublic }),
    });
    if (res.ok) location.reload();
  }}
  className={`mt-2 px-4 py-2 rounded ${book.isPublic ? 'bg-yellow-500' : 'bg-gray-400'} text-white`}
>
  {book.isPublic ? '🔒 unpublic' : '🌍 public'}
</button>


      {/* Notes */}
      <h2 className="mt-10 text-xl font-bold">📝 Reading Notes</h2>
      <form onSubmit={handleNoteSubmit} className="space-y-2 mt-2 mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="w-full p-2 border rounded"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editingNote ? 'Update Note' : 'Add Note'}
        </button>
      </form>

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

        {/* 公開切換按鈕 */}
        <button
          onClick={async () => {
            await fetch(`/api/notes/${note._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isPublic: !note.isPublic }),
            });
            await fetchNotes(); // 重新載入
          }}
          className={`text-sm px-2 py-1 rounded ${
            note.isPublic ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'
          }`}
        >
          {note.isPublic ? 'unpublic' : 'public'}
        </button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}
