import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site-seo';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: PUBLIC_ROUTES,
			disallow: ['/admin', '/api', '/checkout', '/account-infos', '/order-history'],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
