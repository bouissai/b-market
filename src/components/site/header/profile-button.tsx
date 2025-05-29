import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, UserRound } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const ProfileButton = ({ goTo }: { goTo: (href: string) => void }) => {
	const { data: session } = useSession();
	const { signOut } = useAuthStore();
	const router = useRouter();

	return (
		<div className="flex space-x-1 gap-4">
			{session ? (
				<DropdownMenu>
					<DropdownMenuTrigger className="focus:outline-none">
						<Avatar className="h-9 w-9">
							<AvatarImage
								src="/placeholder.svg"
								alt={session.user?.firstname || 'U'}
							/>
							<AvatarFallback>
								{session.user?.firstname?.charAt(0) || 'U'}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => goTo('/compte?tab=commandes')}>
							Mes commandes
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => goTo('/compte?tab=infos')}>
							Mes informations personnelles
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-red-600"
							onClick={() => signOut(false)}>
							<LogOut className="mr-2 h-4 w-4" />
							Se déconnecter
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button
					size="icon"
					variant="ghost"
					onClick={() => router.push('/auth')}>
					<UserRound />
				</Button>
			)}
		</div>
	);
};
