import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  try {
    const requestURL = new URL(request.url);
    const refererHeader = request.headers.get("referer");

    if (!refererHeader) {
      throw new Error("referer header missing");
    }

    const refererURL = new URL(refererHeader);

    if (refererURL.origin !== requestURL.origin) {
      throw new Error("origin mismatch");
    }
  } catch (error) {
    console.log(`[${new Date().toISOString()}] middleware: Request URL matched, redirecting to main page. Request URL: ${request.url}`);
    // executed if one of the URLs fails to parse, or if origin doesn't match
    return NextResponse.redirect(new URL('/', request.url));
  }

}
export const config = {
  matcher: [
    '/api/:path*', // Match all request paths starting with /api/
  ],
}