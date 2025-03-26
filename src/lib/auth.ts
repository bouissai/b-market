import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/types/user';
import { compare } from 'bcryptjs';

export const { auth, handlers, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: { email: {}, password: {} },
			authorize: async credentials => {
				const validated = await signInSchema.parseAsync(credentials);
				const user = await prisma.user.findFirst({
					where: { email: validated.email },
				});
				if (!user || !(await compare(validated.password, user.password))) {
					throw new Error('Invalid credentials');
				}
				return {
					...user,
					isAdmin: user.isAdmin ?? false,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.isAdmin = user.isAdmin;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			session.user.isAdmin = token.isAdmin as boolean;
			return session;
		},
	},
});
