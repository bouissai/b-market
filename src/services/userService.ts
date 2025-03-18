import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}
