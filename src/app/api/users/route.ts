import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: true,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Les champs "nom" et "email" sont requis.' },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé.' },
        { status: 409 },
      );
    }

    const newUser = await prisma.user.create({
      data: { name, email, phone: phone || null, password: '1234' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l’ajout de l’utilisateur:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
