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

export function AdminBreadcrumb() {
  const pathname = usePathname();

  // Découpe l'URL et enlève les parties vides
  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment.length > 0 && segment !== 'admin');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem key={'/admin'}>
          <BreadcrumbLink href="/admin">admin</BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          console;

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem key={href}>
                {isLast ? (
                  <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {decodeURIComponent(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
