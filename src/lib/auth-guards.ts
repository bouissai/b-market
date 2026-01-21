import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
	const session = await auth();

	if (!session || !session.user?.isAdmin) {
		return NextResponse.json(
			{ message: 'Accès non autorisé' },
			{ status: 403 },
		);
	}

	return session;
}
