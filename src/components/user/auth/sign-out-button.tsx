import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const SignOutButton = () => {
	const handleSignOut = async () => {
		await signOut();
	};
	return (
		<>
			<Button onClick={() => handleSignOut()} type="submit">
				Déconnexion
			</Button>
		</>
	);
};

export default SignOutButton;
