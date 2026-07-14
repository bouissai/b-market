import { getLandingReviews } from '@/services/landingService';

export async function GET() {
	const reviews = await getLandingReviews();

	return Response.json(reviews, {
		headers: {
			'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600',
		},
	});
}
