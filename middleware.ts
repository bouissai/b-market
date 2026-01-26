import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicApiPrefixes = [
    "/api/auth",
    "/api/google-reviews",
    "/api/contact",
    "/api/promo-codes/validate",
  ];

  // /api/*
  if (pathname.startsWith("/api")) {
    if (publicApiPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.next();
  }

  // /admin/*
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // IMPORTANT: il faut que ton JWT contienne isAdmin
    // (via callbacks.jwt + callbacks.session côté NextAuth)
    if ((token as any).isAdmin !== true) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
