// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    // Vérification si l'email existe déjà
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

    // Créer un token de vérification valide pendant 24h
    const token = randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // Transaction pour créer l'utilisateur et le token de vérification
    const { user, verificationToken } = await prisma.$transaction(async (tx : Prisma.TransactionClient) => {
      // Créer l'utilisateur avec emailVerified null
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          phone: phone || null,
          emailVerified: null, // Explicitement null jusqu'à vérification
        },
      });

      // Créer un token de vérification
      const verificationToken = await tx.verificationToken.create({
        data: {
          identifier: user.email,
          token,
          expires,
        },
      });

      return { user, verificationToken };
    });

    // Envoyer l'email de vérification
    await sendVerificationEmail({
      email: user.email,
      token: verificationToken.token,
      name: user.name || '',
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
        message: 'User created. Please verify your email.',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}