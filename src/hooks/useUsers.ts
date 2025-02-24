import { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok)
        throw new Error('Erreur lors du chargement des utilisateurs');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map((a) => (a.id === updatedUser.id ? updatedUser : a)));
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Erreur',
          description:
            data.message || 'Une erreur est survenue lors de la suppression',
          variant: 'destructive',
        });
        return false;
      }

      setUsers(users.filter((a) => a.id !== id));
      return true;
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    users,
    isLoading,
    error,
    addUser,
    updateUser,
    deleteUser,
    fetchUsers,
  };
}
