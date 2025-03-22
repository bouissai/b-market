import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const SignOutButton = () => {
	const { data: session } = useSession();
	if (session) {
		const handleSignOut = async () => {
			await signOut();
		};
		return (
			<>
				<Button onClick={() => handleSignOut()} type="submit">
					Sign Out
				</Button>
			</>
		);
	} else {
		return null;
	}
};

export default SignOutButton;
