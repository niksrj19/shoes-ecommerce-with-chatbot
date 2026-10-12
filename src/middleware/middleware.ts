import { NextResponse, type NextRequest } from "next/server";

// Routes requiring active user authentication
const PROTECTED_ROUTES = ["/checkout", "/orders", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current route needs protection
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // In dual-token setups, check accessToken first, then fallback to refreshToken
  // (In case accessToken just expired and needs client-side background renewal)
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("refreshToken")?.value;

  // 1. If accessing a protected route without tokens -> Redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user is already authenticated and visits the login page -> Redirect to home
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};