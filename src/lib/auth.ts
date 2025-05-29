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
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.user = user;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.user) {
				// @ts-ignore
				session.user = token.user;
			}
			return session;
		},
	},
	pages: {
		error: '/auth/error',  // Permet d'afficher une page d'erreur personnalisée
	},
	trustHost: true,  // Permet d'ajouter l'hôte comme étant de confiance
});
