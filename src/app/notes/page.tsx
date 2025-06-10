'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotesOverviewPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [books, setBooks] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
        const uniqueBookIds = [...new Set(data.map((n: any) => n.bookId))];
        return Promise.all(uniqueBookIds.map(id =>
          fetch(`/api/books/${id}`).then(res => res.ok ? res.json() : null)
        ));
      })
      .then((booksData) => {
        const bookMap: Record<string, any> = {};
        booksData?.forEach((b) => {
          if (b && b._id) bookMap[b._id] = b;
        });
        setBooks(bookMap);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (noteId: string) => {
    await fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });
    setEditNoteId(null);
    setEditContent('');
    location.reload();
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Delete this note?')) return;
    await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    setNotes((prev) => prev.filter((n) => n._id !== noteId));
  };

  if (loading) return <div className="p-6">Loading notes...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📒 All Reading Notes</h1>
      {notes.map((note) => {
        const book = books[note.bookId] || {};
        return (
          <div key={note._id} className="mb-6 border rounded p-4 bg-white shadow-sm">
            <div className="flex gap-4">
              {book.thumbnail && (
                <img src={book.thumbnail} alt={book.title} className="w-20 h-28 object-cover rounded" />
              )}
              <div className="flex-1">
                <Link href={`/books/${note.bookId}`}>
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">{book.title || 'Unknown Book'}</h2>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{book.authors?.join(', ')}</p>

                {editNoteId === note._id ? (
                  <>
                    <textarea
                      className="w-full p-2 border rounded mb-2"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdate(note._id)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditNoteId(null);
                        setEditContent('');
                      }}
                      className="text-sm text-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Updated: {new Date(note.updatedAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => {
                          setEditNoteId(note._id);
                          setEditContent(note.content);
                        }}
                        className="text-sm text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="text-sm text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
