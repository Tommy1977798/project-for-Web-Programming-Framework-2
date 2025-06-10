import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';
import Note from '@/models/Note';

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  await connectDB();

  const { userId } = params;

  const publicBooks = await Book.find({ userId, isPublic: true }).select('-__v');
  const publicNotes = await Note.find({ userId, isPublic: true }).select('-__v');

  return NextResponse.json({ books: publicBooks, notes: publicNotes });
}
