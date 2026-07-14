import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site-seo';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	return PUBLIC_ROUTES.map(route => ({
		url: `${SITE_URL}${route}`,
		lastModified: now,
		changeFrequency: route === '/' ? 'weekly' : 'monthly',
		priority: route === '/' ? 1 : route === '/products' ? 0.9 : 0.7,
	}));
}
