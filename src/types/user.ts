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

// types/user.ts
export const signUpSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Adresse email invalide" }),
  confirmEmail: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  confirmPassword: z.string(),
}).refine(data => data.email === data.confirmEmail, {
  message: "Les adresses email ne correspondent pas",
  path: ["confirmEmail"],
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});



export const signInSchema = z.object({
	email: z.string().email({
		message: "L'adresse email est pas valide.",
	}),
	password: z.string().min(8, {
		message: 'Le mot de passe doit faire 8 caractères minimum.',
	}),
});
