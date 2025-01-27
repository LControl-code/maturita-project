import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware function that validates the request's referrer against the request URL.
 * If validation fails, redirects to the root path.
 * 
 * @param request - The incoming Next.js request object
 * @returns {NextResponse | undefined} Redirects to root path if validation fails, undefined otherwise
 * @throws {Error} When referer header is missing or when origins don't match
 * 
 * Security middleware that:
 * - Checks if referer header exists
 * - Validates that request origin matches referer origin
 * - Redirects to homepage if validation fails
 */
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
    // '/api/:path*', // Match all request paths starting with /api/
  ],
}