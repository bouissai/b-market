import { ArticleImageDetails } from "@/types/image"
import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth-guards";

const PUBLIC_ID_REGEX = /^[A-Za-z0-9/_-]{1,200}$/;

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) {
    return adminCheck;
  }

  try {
    const result = await cloudinary.api.resources({
      type: "upload", // on ne récupère que les fichiers uploadés
      resource_type: "image",
      max_results: 100,
    });

const images: ArticleImageDetails[] = result.resources.map(
  (img: {
    asset_id: string
    public_id: string
    url: string
    created_at: string
    width: number
    height: number
    format: string
    version: number
    resource_type: string
    type: string
    bytes: number
    folder?: string
    original_filename?: string
    secure_url?: string
  }) => ({
    asset_id: img.asset_id,
    public_id: img.public_id,
    format: img.format,
    version: img.version,
    resource_type: img.resource_type,
    type: img.type,
    created_at: img.created_at,
    bytes: img.bytes,
    width: img.width,
    height: img.height,
    asset_folder: img.folder,
    display_name: img.original_filename,
    url: img.url,
    secure_url: img.secure_url,
  })
)


    return NextResponse.json({ images });
  } catch (error) {
    console.error("Erreur lors de la récupération des images Cloudinary :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les images" },
      { status: 500 }
    );
  }
}



export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) {
    return adminCheck;
  }

  try {
    // Récupérer le publicId depuis l'URL de la requête
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    
    console.log("API: Received request to delete publicId:", publicId);

    if (!publicId) {
      console.log("API: Missing publicId in request");
      return NextResponse.json(
        { message: 'Public ID is required' },
        { status: 400 }
      );
    }
    if (!PUBLIC_ID_REGEX.test(publicId)) {
      return NextResponse.json(
        { message: 'Public ID invalide' },
        { status: 400 }
      );
    }

    // Supprimer l'image
    console.log("API: Attempting to delete from Cloudinary...");
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("API: Cloudinary delete result:", result);

    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Image deleted successfully' });
    } else {
      console.error("API: Cloudinary deletion failed:", result);
      return NextResponse.json(
        { message: 'Failed to delete image', details: result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API: Error deleting image:", error);
    return NextResponse.json(
      { message: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest) {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) {
    return adminCheck;
  }

  try {
    const { publicId, updates } = await req.json()

    if (!publicId || !updates || typeof updates !== "object") {
      return NextResponse.json({ message: "Données invalides" }, { status: 400 })
    }
    if (!PUBLIC_ID_REGEX.test(publicId)) {
      return NextResponse.json({ message: "Public ID invalide" }, { status: 400 })
    }

    // Exemple : ajout de tags et de contexte (comme alt text et caption)
    const result = await cloudinary.api.update(publicId, {
      context: updates.context, // ex : { alt: "Texte alternatif", caption: "Une belle pièce de viande" }
      tags: updates.tags        // ex : ["promo", "agneau"]
    })

    return NextResponse.json({ message: "Image mise à jour", updatedData: result }, { status: 200 })
  } catch (error) {
    console.error("Erreur API Cloudinary:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
