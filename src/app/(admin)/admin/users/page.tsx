'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers } from '@/hooks/useUsers';
import { Loader2 } from 'lucide-react';

import UserForm from '@/components/admin/userAdmin/userForm';
import { UserTable } from '@/components/admin/userAdmin/userTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function UserPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { users, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <div className="flex justify-between items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Ajouter un client</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Nouveau client</DialogTitle>
                </DialogHeader>
                <UserForm
                  onSubmit={() => console.log('SUBMIT')}
                  onCancel={() => console.log('CANCEL')}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable data={users} />
        </CardContent>
      </Card>
    </div>
  );
}
