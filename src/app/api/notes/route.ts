import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Note from '@/models/Note';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const notes = await Note.find({ userId: decoded.userId }).sort({ updatedAt: -1 });

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const { bookId, content } = await req.json();

  const newNote = await Note.create({
    userId: decoded.userId,
    bookId,
    content,
  });

  return NextResponse.json(newNote);
}
