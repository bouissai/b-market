import { db } from '@/app/lib/db';
import { User } from '@prisma/client';

export async function getAllUsers(): Promise<User[]> {
  return await db.user.findMany();
}
