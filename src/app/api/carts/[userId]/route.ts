import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ userId: string }> },
) {
	console.log('carts get');
	try {
		const userId = (await params).userId;
		const cartClient = await prisma?.cart.findUnique({
			where: { userId },
		});
		return NextResponse.json(cartClient, { status: 200 });
	} catch (error) {
		console.error('Error fetching cart for user : ', error);
		return NextResponse.json(
			{ error: 'Error fetching cart for user : ' },
			{ status: 500 },
		);
	}
}
