  // Extraire le publicId d'une URL Cloudinary
  export function extractPublicId(url: string,defaultImageUrl:string): string | null {
    if (!url || url === defaultImageUrl) return null;

    try {
      const regex = /\/v\d+\/(.+)\.\w+/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Erreur lors de l'extraction du publicId:", error);
      return null;
    }
  };