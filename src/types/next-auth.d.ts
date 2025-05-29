import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
	interface User extends DefaultUser {
		id: string;
		firstname: string;
		lastname: string;
		isAdmin: boolean;
		phone: string | null;
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
