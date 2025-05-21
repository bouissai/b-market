import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import {
	addOrUpdateCartItem,
	removeCartItemByUserId,
} from '@/services/cartItemService';

export async function POST(req: Request) {
	try {
		const session = await auth();
		const body = await req.json();

		const { articleId, quantity, userId } = body;

		if (!session || session.user.id !== userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		if (!articleId || typeof quantity !== 'number') {
			return NextResponse.json(
				{ error: 'Missing or invalid fields' },
				{ status: 400 },
			);
		}

		const cart = await addOrUpdateCartItem(userId, articleId, quantity);

		return NextResponse.json(cart, { status: 200 });
	} catch (error) {
		console.error('[POST /api/carts/items] Error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: Request) {
	try {
		const session = await auth();
		const body = await req.json();

		const { articleId, userId } = body;

		if (!session || session.user.id !== userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		if (!articleId) {
			return NextResponse.json(
				{ error: 'Missing or invalid fields' },
				{ status: 400 },
			);
		}

		const cart = await removeCartItemByUserId(userId, articleId);

		return NextResponse.json(cart, { status: 200 });
	} catch (error) {
		console.error('[DELETE /api/carts/items] Error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
