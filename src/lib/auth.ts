// import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { prisma } from '@/lib/prisma';
// import Credentials from '@auth/core/providers/credentials';
// import { signInSchema } from '@/types/user';
// import { compare } from 'bcryptjs';
//
// const adapter = PrismaAdapter(prisma);
//
// export const { handlers, signIn, signOut, auth } = NextAuth({
// 	adapter: adapter,
// 	session: { strategy: 'jwt' },
// 	providers: [
// 		Credentials({
// 			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
// 			// e.g. domain, username, password, 2FA token, etc.
// 			credentials: {
// 				email: {},
// 				password: {},
// 			},
// 			authorize: async credentials => {
// 				const validatedCredentials = signInSchema.parse(credentials);
//
// 				const user = await prisma.user.findFirst({
// 					where: {
// 						email: validatedCredentials.email,
// 						password: validatedCredentials.password,
// 					},
// 				});
//
// 				if (!user) {
// 					throw new Error('Invalid credentials');
// 				}
//
// 				const passwordCorrect = await compare(
// 					validatedCredentials.password,
// 					user.password,
// 				);
// 				if (!passwordCorrect) {
// 					throw new Error('Invalid credentials');
// 				}
//
// 				return user;
// 			},
// 		}),
// 	],
// 	// callbacks: {
// 	// 	async jwt({ token, account }) {
// 	// 		if (account?.provider === 'credentials') {
// 	// 			token.credentials = true;
// 	// 		}
// 	// 		return token;
// 	// 	},
// 	// },
// 	// jwt: {
// 	// 	encode: async function (params) {
// 	// 		if (params.token?.credentials) {
// 	// 			const sessionToken = uuid();
// 	//
// 	// 			if (!params.token.sub) {
// 	// 				throw new Error('No user ID found in token');
// 	// 			}
// 	//
// 	// 			const createdSession = await adapter?.createSession?.({
// 	// 				sessionToken: sessionToken,
// 	// 				userId: params.token.sub,
// 	// 				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
// 	// 			});
// 	//
// 	// 			if (!createdSession) {
// 	// 				throw new Error('Failed to create session');
// 	// 			}
// 	//
// 	// 			return sessionToken;
// 	// 		}
// 	// 		return defaultEncode(params);
// 	// 	},
// 	// },
// });
