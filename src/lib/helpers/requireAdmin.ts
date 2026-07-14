import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
	const session = await auth();

	if (!session?.user) {
		return {
			error: NextResponse.json(
				{ message: 'Authentification requise' },
				{ status: 401 },
			),
		};
	}

	if (!session.user.isAdmin) {
		return {
			error: NextResponse.json(
				{ message: 'Accès administrateur requis' },
				{ status: 403 },
			),
		};
	}

	return { session };
}
