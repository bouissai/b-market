import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';

const SignOutButton = () => {
	const handleSignOut = async () => {
		await signOut();
	};
	return (
		<>
			<Button variant={'link'} onClick={() => handleSignOut()} type="submit">
				Déconnexion
				<LogOutIcon />
			</Button>
		</>
	);
};

export default SignOutButton;
