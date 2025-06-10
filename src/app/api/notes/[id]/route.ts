import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Note from '@/models/Note';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, isPublic } = await req.json(); // ✅ 加入 isPublic

  const update: any = { updatedAt: new Date() };
  if (content !== undefined) update.content = content;
  if (isPublic !== undefined) update.isPublic = isPublic;

  const updatedNote = await Note.findByIdAndUpdate(params.id, update, { new: true });

  return updatedNote
    ? NextResponse.json(updatedNote)
    : NextResponse.json({ error: 'Note not found' }, { status: 404 });
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await Note.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Note deleted' });
}
