import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const book = await Book.findById(params.id);
  return book
    ? NextResponse.json(book)
    : NextResponse.json({ error: 'Book not found' }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const updates = await req.json();
  const book = await Book.findByIdAndUpdate(params.id, updates, { new: true });
  return NextResponse.json(book);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await Book.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Book deleted' });
}
