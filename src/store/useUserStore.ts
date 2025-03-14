import { User, UserPut, UserPost } from '@/types/user';
import { create } from 'zustand';

interface UserStore {
  users: User[];
  isLoading: boolean;
  isSubmitting: boolean;
  isFormOpen: boolean;
  mode: 'new' | 'edit' | 'delete' | null;
  selectedUser: UserPut | null;
  fetchUsers: () => Promise<void>;
  setSelectedUser: (
    user: UserPut | null,
    mode: 'new' | 'edit' | 'delete' | null,
  ) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  addUser: (user: UserPost) => Promise<void>;
  updateUser: (user: UserPut) => Promise<void>;
  deleteUser: () => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  isSubmitting: false,
  isFormOpen: false,
  mode: null,
  selectedUser: null,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      set({ users: data, isLoading: false });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      set({ isLoading: false });
    }
  },

  setSelectedUser: (user, mode) => {
    set({ selectedUser: user, mode });
  },

  setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),

  addUser: async (user) => {
    set({ isSubmitting: true });
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      await get().fetchUsers();
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’utilisateur:', error);
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateUser: async (user) => {
    set({ isSubmitting: true });
    try {
      await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      await get().fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la modification de l’utilisateur:', error);
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteUser: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return false;

    try {
      await fetch(`/api/users/${selectedUser.id}`, { method: 'DELETE' });
      await get().fetchUsers();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l’utilisateur:', error);
      return false;
    }
  },
}));
