import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const userId = decoded.userId;

  const body = await req.json();
  const { slug } = body;

  // Check for duplicate slug
  const existing = await User.findOne({ profileSlug: slug });
  if (existing) return NextResponse.json({ error: 'Slug already taken' }, { status: 400 });

  await User.findByIdAndUpdate(userId, { profileSlug: slug });

  return NextResponse.json({ success: true });
}
