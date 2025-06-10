import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('token', '', { path: '/', expires: new Date(0) }); // 清除 token cookie
  return response;
}
