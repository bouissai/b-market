import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		//on vérifie si l'email existe déjà
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: 'User already exists' },
				{ status: 409 },
			);
		}

		const hashedPassword = await hash(password, 10);

		// Save user to database
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		return NextResponse.json(
			{
				user: {
					id: user.id,
					email: user.email,
				},
			},
			{ status: 201 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 500 },
		);
	}
}
