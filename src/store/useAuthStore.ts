// stores/authStore.ts
import { create } from 'zustand';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { signInSchema, signUpSchema } from '@/types/user';
import { z } from 'zod';

interface AuthState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  signIn: (data: z.infer<typeof signInSchema>) => Promise<boolean>;
  signUp: (data: z.infer<typeof signUpSchema>) => Promise<boolean>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  isSubmitting: false,
  error: null,

  setError: (error) => set({ error }),

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
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json();
        set({ error: errorJson?.message || 'Erreur lors de la création du compte.' });
        return false;
      }

      return true;
    } catch (err) {
      console.error('Erreur signUp :', err);
      set({ error: 'Erreur inattendue lors de l’inscription.' });
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
