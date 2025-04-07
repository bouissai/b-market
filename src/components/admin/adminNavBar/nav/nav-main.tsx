import { Separator } from '@/components/ui/separator';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={
                  item.url === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.url)
                }
              >
                <a href={item.url} className="flex items-center gap-2 px-2 py-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {index < items.length - 1 && <Separator/>}
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
