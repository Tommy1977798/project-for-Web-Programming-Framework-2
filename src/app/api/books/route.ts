import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const books = await Book.find({ userId: decoded.userId });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const body = await req.json();

  const book = await Book.create({ ...body, userId: decoded.userId });
  return NextResponse.json(book);
}
