// src/app/api/google-reviews/route.ts
let cachedReviews: any[] | null = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24h en millisecondes

export async function GET() {
  const now = Date.now();

  // Log: vérifie si on utilise le cache
  if (cachedReviews && lastFetched && now - lastFetched < CACHE_DURATION) {
    console.log(`[Google Reviews] ✅ Utilisation du cache - Dernier fetch : ${new Date(lastFetched).toISOString()}`);
    return new Response(JSON.stringify(cachedReviews), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`[Google Reviews] 🔄 Cache expiré ou absent - Requête envoyée à l'API Google`);

  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&language=fr&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result || !data.result.reviews) {
      console.warn(`[Google Reviews] ⚠️ Aucun avis trouvé dans la réponse`);
      return new Response(JSON.stringify({ message: "Aucun avis trouvé." }), { status: 404 });
    }

    const reviews = data.result.reviews
      .filter((r: any) => r.rating >= 4)
      .map((r: any, index: number) => ({
        id: index,
        name: r.author_name,
        role: 'Avis Google',
        image: r.profile_photo_url || '/placeholder.svg',
        quote: r.text,
        rating: r.rating,
      }));

    // Log: combien d'avis récupérés
    console.log(`[Google Reviews] ✅ ${reviews.length} avis récupérés et filtrés (note >= 4)`);

    // Mise à jour du cache
    cachedReviews = reviews;
    lastFetched = now;

    return new Response(JSON.stringify(reviews), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`[Google Reviews] ❌ Erreur lors de la récupération des avis :`, error);
    return new Response(JSON.stringify({ message: "Erreur lors de la récupération des avis." }), { status: 500 });
  }
}
