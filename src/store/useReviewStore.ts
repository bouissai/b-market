// src/store/useReviewsStore.ts
import { create } from 'zustand';

type Review = {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
};

type ReviewsStore = {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: () => Promise<void>;
};

export const useReviewsStore = create<ReviewsStore>((set) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/google-reviews');
      if (!res.ok) throw new Error('Erreur lors de la récupération des avis');
      const data: Review[] = await res.json();
      const filtered = data.filter((r) => r.rating >= 4);
      set({ reviews: filtered, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Erreur inconnue', loading: false });
    }
  },
}));
