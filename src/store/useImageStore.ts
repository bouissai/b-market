import { ArticleImageDetails } from "@/types/image";
import { create } from "zustand";

type ImageStore = {
  images: ArticleImageDetails[];
  defaultImageUrl: string;
  fetchImages: () => Promise<void>;
  deleteImage: (publicId: string) => Promise<void>;
  updateImage: (publicId: string, updates: Partial<ArticleImageDetails>) => Promise<void>;
  uploadArticleImage: (file: File) => Promise<string | null>;
};

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  defaultImageUrl: '/images/no-img.png',

  // 🔹 Charger les images depuis Cloudinary
  fetchImages: async () => {
    try {
      const response = await fetch("/api/cloudinary");
      if (!response.ok) throw new Error("Erreur lors du chargement des images");

      const data = await response.json();
      set({ images: data.images });
    } catch (error) {
      console.error("Erreur fetchImages:", error);
    }
  },

  // 🔹 Upload d'image
  uploadArticleImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "products");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/ddqrywesr/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        set((state) => ({
          images: [...state.images, { ...data, public_id: data.public_id }],
        }));
        return data.secure_url;
      } else {
        throw new Error("Erreur lors du téléversement");
      }
    } catch (error) {
      console.error("Erreur uploadImage:", error);
      return null;
    }
  },

  // 🔹 Mise à jour d'image (nom, métadonnées, etc.)
  updateImage: async (publicId: string, updates: Partial<ArticleImageDetails>) => {
    try {
      if (!publicId || Object.keys(updates).length === 0) return;

      // Mise à jour Cloudinary (modification du nom ou des métadonnées)
      const response = await fetch(`/api/cloudinary/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, updates }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'image");

      set((state) => ({
        images: state.images.map((image) =>
          image.public_id === publicId ? { ...image, ...updates } : image
        ),
      }));
    } catch (error) {
      console.error("Erreur updateImage:", error);
    }
  },

  // 🔹 Suppression d'image
  deleteImage: async (publicId: string) => {
    try {
      if (!publicId) return;

      const response = await fetch(`/api/cloudinary?publicId=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de l'image");

      set((state) => ({
        images: state.images.filter((img) => img.public_id !== publicId),
      }));

    } catch (error) {
      console.error("Erreur deleteImage:", error);
    }
  },
}));