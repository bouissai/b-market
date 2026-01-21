import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const publicApiPrefixes = [
		'/api/auth',
		'/api/google-reviews',
		'/api/contact',
		'/api/promo-codes/validate',
	];

	if (pathname.startsWith('/api')) {
		if (publicApiPrefixes.some(prefix => pathname.startsWith(prefix))) {
			return NextResponse.next();
		}

		const session = await auth();
		if (!session) {
			return NextResponse.json(
				{ message: 'Non authentifié' },
				{ status: 401 },
			);
		}

		return NextResponse.next();
	}

	if (pathname.startsWith('/admin')) {
		const session = await auth();

		if (!session) {
			return NextResponse.redirect(new URL('/auth/signin', req.url));
		}

		if (!session.user?.isAdmin) {
			return NextResponse.redirect(new URL('/', req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*', '/api/:path*'],
};
