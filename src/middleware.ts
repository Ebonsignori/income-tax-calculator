import { NextResponse } from "next/server";

// Middleware is disabled because it's not compatible with "output: export"
// The .well-known file is handled by creating a static file in public/.well-known/
export function middleware() {
  return NextResponse.next();
}

// Disable middleware by matching nothing
export const config = {
  matcher: [],
};
