import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/types/user';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: adapter,
	session: { strategy: 'jwt' },
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
			},
			authorize: async credentials => {
				const validatedCredentials =
					await signInSchema.parseAsync(credentials);

				const user = await prisma.user.findFirst({
					where: {
						email: validatedCredentials.email,
					},
				});

				if (!user) {
					throw new Error('USER_NOT_FOUND');
				}

				const passwordCorrect = await compare(
					validatedCredentials.password,
					user.password,
				);
				if (!passwordCorrect) {
					throw new Error('INVALID_PASSWORD');
				}

				return user;
			},
		}),
	],
	callbacks: {
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
				},
			};
		},
		jwt: ({ token, user }) => {
			if (user) {
				return {
					...token,
					id: user.id,
				};
			}
			return token;
		},
	},
});

export const { GET, POST } = handlers;
