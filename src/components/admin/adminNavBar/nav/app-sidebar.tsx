'use client';

import { useSession, signOut } from 'next-auth/react';
import {
	Beef,
	ChartBarStacked,
	Home,
	LogOutIcon,
	ShoppingBag,
	User,
} from 'lucide-react';
import { NavMain } from '@/components/admin/adminNavBar/nav/nav-main';
import { NavUser } from '@/components/admin/adminNavBar/nav/nav-user';
import { Button } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function AppSidebar({ ...props }) {
	const { data: session } = useSession();

	const handleSignOut = async () => {
		await signOut({ callbackUrl: '/' });
	};

	const user = {
		name: session?.user?.name ?? 'Invité',
		email: session?.user?.email ?? 'Non connecté',
		avatar: session?.user?.image ?? '',
	};

	const navItems = [
		{
			title: 'Tableau de bord',
			url: '/admin',
			icon: Home,
		},
		{
			title: 'Gestion des articles',
			url: '/admin/article',
			icon: Beef,
		},
		{
			title: 'Gestion des catégories',
			url: '/admin/category',
			icon: ChartBarStacked,
		},
		{
			title: 'Gestion des commandes',
			url: '/admin/orders',
			icon: ShoppingBag,
		},
		{
			title: 'Gestion des utilisateurs',
			url: '/admin/users',
			icon: User,
		},
	];

	return (
		<Sidebar variant="inset" collapsible="icon" {...props}>
			<SidebarHeader>
				<NavUser user={user} />
			</SidebarHeader>
			<Separator />

			<SidebarContent>
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				<Button onClick={handleSignOut} aria-label="Se déconnecter">
					<LogOutIcon />
					Déconnexion
				</Button>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
