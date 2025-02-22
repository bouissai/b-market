'use client';

import { Beef, ChartBarStacked, LogOutIcon, ShoppingBag } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav/nav-main';
import { NavUser } from '@/components/nav/nav-user';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

//  TODO.
const data = {
  user: {
    name: 'admin',
    email: 'admin@example.com',
    avatar: '',
  },
  navMain: [
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
    // {
    // 	title: "Gestion des commandes",
    // 	url: "/admin/order",
    // 	icon: PackageSearch,
    // },
    // Exemple pour groupe
    // {
    // 	title: "a",
    // 	url: "#",
    // 	icon: a,
    // 	items: [
    // 		{
    // 			title: "b",
    // 			url: "#",
    // 		},
    // 		{
    // 			title: "c",
    // 			url: "#",
    // 		},
    // 	],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button>
          <LogOutIcon />
          Déconnexion
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
