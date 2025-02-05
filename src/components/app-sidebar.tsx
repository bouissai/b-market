"use client";

import * as React from "react";
import { Beef, ChartBarStacked } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

//  TODO.
const data = {
	user: {
		name: "admin",
		email: "admin@example.com",
		avatar: "",
	},
	teams: [
		{
			name: "B Market",
			logo: Beef,
			plan: "Partie admin",
		},
	],
	navMain: [
		{
			title: "Gestion articles",
			url: "/admin/article",
			icon: Beef,
		},
		{
			title: "Gestion des catégories",
			url: "/admin/category",
			icon: ChartBarStacked,
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
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
