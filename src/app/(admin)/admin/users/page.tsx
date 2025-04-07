'use client';

import UserForm from '@/components/admin/userAdmin/userForm';
import { UserTable } from '@/components/admin/userAdmin/userTable';
import { Loading } from '@/components/loading';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/store/useUserStore';
import { UserPut, UserPost, UserDelete } from '@/types/user';
import { useEffect } from 'react';

export default function UserPage() {
	const { toast } = useToast();
	const {
		users,
		isLoading,
		selectedUser,
		mode,
		isFormOpen,
		fetchUsers,
		setSelectedUser,
		setIsFormOpen,
		addUser,
		updateUser,
		deleteUser,
	} = useUserStore();

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	if (isLoading) {
		return <Loading />;
	}

	const handleDelete = async () => {
		const success = await deleteUser();
		if (success) {
			toast({
				title: 'Succès',
				description: 'Utilisateur supprimé avec succès',
			});
		}
	};

	return (
		<div className="p-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Gestion des Utilisateurs</CardTitle>
					<Button
						onClick={() => {
							setIsFormOpen(true);
							setSelectedUser(null, 'new');
						}}>
						Ajouter un utilisateur
					</Button>
				</CardHeader>
				<CardContent>
					<UserTable
						data={users}
						onEdit={(user: UserPut) => {
							setIsFormOpen(true);
							setSelectedUser(user, 'edit');
						}}
						onDelete={(user: UserDelete) => {
							setSelectedUser(
								{ id: user.id, name: user.name, email: '', phone: '' },
								'delete',
							);
						}}
					/>
				</CardContent>
			</Card>

			{isFormOpen && (
				<UserForm
					user={selectedUser}
					onCloseAction={() => setIsFormOpen(false)}
					onSaveAction={async (newUser: UserPut | UserPost) => {
						if (mode === 'edit' && 'id' in newUser) {
							await updateUser(newUser);
						} else {
							await addUser(newUser);
						}
						setIsFormOpen(false);
					}}
				/>
			)}

			<AlertDialog
				open={mode === 'delete'}
				onOpenChange={isOpen => {
					if (!isOpen) setSelectedUser(null, null);
				}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Êtes-vous sûr de vouloir supprimer cet utilisateur ?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action ne peut pas être annulée.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => setSelectedUser(null, null)}>
							Annuler
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							Supprimer
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
