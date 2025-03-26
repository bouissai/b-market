import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
	interface User extends DefaultUser {
		id: string;
		isAdmin?: boolean;
	}

	interface Session extends DefaultSession {
		user: User;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		isAdmin?: boolean;
	}
}
