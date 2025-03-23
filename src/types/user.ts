import { orderDTO } from './order';
import { z } from 'zod';

export interface User {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
	createdAt: Date;
	orders?: orderDTO[];
}

export interface UserPut {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
}

export interface UserPost {
	name: string;
	email: string;
	phone?: string | null;
}

export interface UserDelete {
	id: string;
	name: string;
}

export const signUpSchema = z
	.object({
		email: z
			.string({
				message: 'Le champ email est requis.',
			})
			.email({
				message: "L'adresse email est pas valide.",
			}),
		confirmEmail: z.string().email({}),
		password: z.string().min(8, {
			message: 'Le mot de passe doit faire 8 caractères minimum.',
		}),
		confirmPassword: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.email !== data.confirmEmail) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Les adresses email ne correspondent pas.',
				path: ['confirmEmail'],
			});
		}
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Les mots de passe ne correspondent pas.',
				path: ['confirmPassword'],
			});
		}
	});

export const signInSchema = z.object({
	email: z.string().email({
		message: "L'adresse email est pas valide.",
	}),
	password: z.string().min(8, {
		message: 'Le mot de passe doit faire 8 caractères minimum.',
	}),
});
