import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export type LandingCategory = {
	id: string;
	name: string;
	image: string | null;
};

export type LandingReview = {
	id: number;
	name: string;
	role: string;
	image: string;
	quote: string;
	rating: number;
};

export async function getFeaturedLandingCategories(): Promise<LandingCategory[]> {
	return prisma.category.findMany({
		where: { featured: true },
		orderBy: { name: 'asc' },
		select: {
			id: true,
			name: true,
			image: true,
		},
	});
}

export const getLandingReviews = unstable_cache(
	async (): Promise<LandingReview[]> => {
		const placeId = process.env.GOOGLE_PLACE_ID;
		const apiKey = process.env.GOOGLE_MAPS_API_KEY;

		if (!placeId || !apiKey) {
			return [];
		}

		const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
		url.searchParams.set('place_id', placeId);
		url.searchParams.set('fields', 'reviews');
		url.searchParams.set('language', 'fr');
		url.searchParams.set('key', apiKey);

		const response = await fetch(url, { next: { revalidate: 86400 } });
		if (!response.ok) return [];

		const data = (await response.json()) as {
			result?: {
				reviews?: Array<{
					author_name: string;
					profile_photo_url?: string;
					text: string;
					rating: number;
				}>;
			};
		};

		return (data.result?.reviews ?? [])
			.filter(review => review.rating >= 4)
			.slice(0, 6)
			.map((review, index) => ({
				id: index,
				name: review.author_name,
				role: 'Avis Google',
				image: review.profile_photo_url || '/images/no-img.png',
				quote: review.text,
				rating: review.rating,
			}));
	},
	['landing-google-reviews'],
	{ revalidate: 86400 },
);
