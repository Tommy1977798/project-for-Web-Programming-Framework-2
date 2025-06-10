import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');

  // 如果訪問受保護頁面但沒登入 → 跳轉到登入頁
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 如果已登入但訪問 login 或 register → 跳轉到 dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/register'], // 哪些路徑受此 middleware 管理
};
