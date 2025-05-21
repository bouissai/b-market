import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { clearCartByUserId } from '@/services/cartService';

export async function DELETE(nextRequest: Request) {
	try {
		const session = await auth();
		const body = await nextRequest.json();

		const { userId } = body;

		if (!session || session.user.id !== userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const cart = await clearCartByUserId(userId);

		if (!cart) {
			return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
		}

		return NextResponse.json(cart, { status: 200 });
	} catch (error) {
		console.error('[DELETE /api/carts/items] Error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
