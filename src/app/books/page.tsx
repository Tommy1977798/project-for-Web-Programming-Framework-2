'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY!;

export default function BookListPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [myBooks, setMyBooks] = useState<any[]>([]);

  // 加载用户的书籍
  const fetchMyBooks = async () => {
    const res = await fetch('/api/books');
    if (res.ok) {
      const data = await res.json();
      setMyBooks(data);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  // Google Books 搜索
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_API_KEY}`);
    const data = await res.json();
    setSearchResults(data.items || []);
  };

  // 添加图书到数据库
  const handleAdd = async (book: any) => {
    const payload = {
      googleId: book.id,
    title: book.volumeInfo.title,
    authors: book.volumeInfo.authors || [],
    thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
    categories: book.volumeInfo.categories || [], 
    };

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchMyBooks();
      alert('Book added!');
    } else {
      const err = await res.json();
      alert('Failed to add: ' + err.error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 My Books</h1>

      {/* 搜索表单 */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          className="border p-2 w-full rounded"
          type="text"
          placeholder="Search books by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search
        </button>
      </form>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {searchResults.map((book) => (
              <div key={book.id} className="border p-2 rounded">
                <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} className="w-full mb-2" />
                <h3 className="font-bold text-sm">{book.volumeInfo.title}</h3>
                <p className="text-xs text-gray-600">{(book.volumeInfo.authors || []).join(', ')}</p>
                <button
                  onClick={() => handleAdd(book)}
                  className="mt-2 bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 我的图书列表 */}
      <h2 className="text-xl font-semibold mb-2">Your Library</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {myBooks.map((book) => (
  <div key={book._id} className="border p-2 rounded">
    <img src={book.thumbnail} alt={book.title} className="w-full mb-2" />
    <h3 className="font-bold text-sm">{book.title}</h3>
    <p className="text-xs text-gray-600">{(book.authors || []).join(', ')}</p>
    <p className="text-xs text-gray-500 mt-1">Status: {book.status}</p>

    <Link
      href={`/books/${book._id}`}
      className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
    >
      View
    </Link>
  </div>
))}
      </div>
    </div>
  );
}
