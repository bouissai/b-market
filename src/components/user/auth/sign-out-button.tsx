import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOutIcon } from "lucide-react";

export function SignOutButton() {
  const { signOut } = useAuthStore();
  return (
    <Button variant="link" onClick={signOut}>
      Déconnexion
      <LogOutIcon />
    </Button>
  );
};
