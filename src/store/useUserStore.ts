import { toast } from "@/hooks/use-toast";
import { User } from "@prisma/client";
import { create } from "zustand";

type UserStore = {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (newUser: User) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (id: string) => Promise<boolean>;
  setSelectedUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");

      const data: User[] = await response.json();
      set({ users: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Une erreur est survenue",
        isLoading: false,
      });
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }), // 🔥 Gérer l'utilisateur sélectionné

  addUser: (newUser) =>
    set((state) => ({
      users: [...state.users, newUser],
    })),

  updateUser: (updatedUser) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      ),
    })),

  deleteUser: async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Erreur",
          description: data.message || "Une erreur est survenue lors de la suppression",
          variant: "destructive",
        });
        return false;
      }

      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        selectedUser: null, // 🔥 Réinitialiser si l'utilisateur supprimé était sélectionné
      }));

      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
      return false;
    }
  },
}));
