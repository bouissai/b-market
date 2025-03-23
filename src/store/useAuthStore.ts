// stores/authStore.ts
import { create } from 'zustand';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { signInSchema, signUpSchema } from '@/types/user';
import { z } from 'zod';

interface AuthState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
  signIn: (data: z.infer<typeof signInSchema>) => Promise<boolean>;
  signUp: (data: z.infer<typeof signUpSchema>) => Promise<boolean>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  setError: (error) => set({ error }),
  setSuccessMessage: (message) => set({ successMessage: message }),

  signIn: async (data) => {
    set({ isSubmitting: true, error: null });

    try {
      const result = await nextAuthSignIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        let message = 'Adresse email ou mot de passe incorrect.';
        if (result.error === 'USER_NOT_FOUND') message = 'Aucun compte trouvé.';
        if (result.error === 'INVALID_PASSWORD') message = 'Mot de passe incorrect.';
        if (result.error === 'EMAIL_NOT_VERIFIED') message = 'Veuillez vérifier votre email avant de vous connecter.';

        set({ error: message });
        return false;
      }

      return true;
    } catch (err) {
      console.error('Erreur signIn :', err);
      set({ error: 'Erreur inattendue lors de la connexion.' });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  signUp: async (data) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        set({ error: result?.message || 'Erreur lors de la création du compte.' });
        return false;
      }

      set({ 
        successMessage: "Compte créé avec succès ! Veuillez vérifier votre boîte de réception pour activer votre compte." 
      });
      
      return true;
    } catch (err) {
      console.error('Erreur signUp :', err);
      set({ error: 'Erreur inattendue lors de l\'inscription.' });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  signOut: async () => {
    try {
      await nextAuthSignOut({ redirect: false });
    } catch (err) {
      console.error('Erreur de déconnexion :', err);
    }
  },
}));