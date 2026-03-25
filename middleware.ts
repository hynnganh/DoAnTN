import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Lấy token và role từ Cookies (Next.js Middleware KHÔNG đọc được localStorage)
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // 2. Chặn truy cập vào /admin hoặc /super-admin nếu chưa đăng nhập đúng quyền
  if (pathname === '/admin' || pathname === '/super-admin') {
    if (!token || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      // Nếu không có token hoặc sai role, đá về login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Nếu đã đăng nhập rồi mà còn mò vào /login thì đá vào trang tương ứng
  if (pathname === '/login' && token) {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Chỉ quét đúng những trang nhạy cảm
export const config = {
  matcher: ['/admin', '/super-admin', '/login'],
};