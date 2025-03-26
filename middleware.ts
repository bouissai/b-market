import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
	const session = await auth();

	if (!session) {
		return NextResponse.redirect(new URL('/auth/signin', req.url));
	}

	if (!session.user?.isAdmin) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*'],
};
