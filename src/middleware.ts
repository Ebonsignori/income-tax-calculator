import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply this middleware in development
  // In production, the site is statically generated and doesn't have this issue
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.next();
  }

  // Let .well-known requests pass through without hitting dynamic routes
  // This prevents Chrome DevTools requests from causing errors in dev mode
  if (request.nextUrl.pathname.startsWith("/.well-known")) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, manifests, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt|webmanifest)).*)",
  ],
};
