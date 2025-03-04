'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import React from 'react';

const breadcrumbNameMap: { [key: string]: string } = {
  admin: 'Tableau de bord',
  article: 'Gestion des articles',
  orders: 'Gestion des commandes',
  category: 'Gestion des categories',
  users: 'Gestion des utilisateurs',
};

export function AdminBreadcrumb() {
  const pathname = usePathname();

  // Découpe l'URL et enlève les parties vides
  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment.length > 0);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const segmentName =
            breadcrumbNameMap[segment] || decodeURIComponent(segment);

          return (
            <React.Fragment key={href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segmentName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{segmentName}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
