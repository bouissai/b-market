import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ArticleGetDto } from '@/types/article';
import { z } from 'zod';

const MAX_LIMIT = 1000;

const QueryParamsSchema = z.object({
	categoryId: z.string().optional(),
	page: z.coerce.number().positive().optional(),
	limit: z.coerce.number().positive().max(MAX_LIMIT).optional(),
});

// 1. Récupérer tous les articles
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const params = Object.fromEntries(searchParams.entries());
		const result = QueryParamsSchema.safeParse(params);

		if (!result.success) {
			return NextResponse.json(
				{
					message: 'Paramètres de requête invalides',
					errors: result.error.format(),
				},
				{ status: 400 },
			);
		}

		const { categoryId, page, limit } = result.data;
		const whereClause: any = {};

		if (categoryId) {
			const categoryExists = await prisma.category.findUnique({
				where: { id: categoryId },
				select: { id: true },
			});

			if (!categoryExists) {
				return NextResponse.json(
					{ message: `La catégorie '${categoryId}' n'existe pas` },
					{ status: 400 },
				);
			}

			whereClause.categoryId = categoryId;
		}

		let actualPage = undefined;
		let actualLimit = undefined;
		let skip = 0;

		if (page && limit) {
			actualPage = page;
			actualLimit = limit;
			skip = (actualPage - 1) * actualLimit;
		}

		const [articles, total] = await Promise.all([
			prisma.article.findMany({
				where: whereClause,
				skip,
				...(actualLimit ? { take: actualLimit } : {}),
				include: {
					category: {
						select: { name: true },
					},
				},
			}),
			prisma.article.count({ where: whereClause }),
		]);

		const articlesDto: ArticleGetDto[] = articles.map(article => ({
			id: article.id,
			name: article.name,
			unit: article.unit,
			price: article.price,
			image: article.image,
			description: article.description || '',
			categoryId: article.categoryId,
			categoryName: article.category.name,
		}));

		return NextResponse.json(
			{ articles: articlesDto, total },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Erreur lors de la récupération des articles :', error);
		return NextResponse.json(
			{ message: 'Échec de la récupération des articles' },
			{ status: 500 },
		);
	}
}

// 2. Ajouter un article
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { name, image, description, price, unit, categoryId } = body;

		if (!body) {
			return NextResponse.json(
				{ message: 'Le corps de la requête est vide ou invalide' },
				{ status: 400 },
			);
		}

		if (!name || !price || !categoryId || !unit) {
			return NextResponse.json(
				{ message: "Le nom, le prix, l'unité et la catégorie sont requis" },
				{ status: 400 },
			);
		}

		if (typeof price !== 'number' || price <= 0) {
			return NextResponse.json(
				{ message: 'Le prix doit être un nombre positif' },
				{ status: 400 },
			);
		}

		const existingArticle = await prisma.article.findFirst({
			where: { name },
		});

		if (existingArticle) {
			return NextResponse.json(
				{ message: `Un article portant le nom '${name}' existe déjà` },
				{ status: 409 },
			);
		}

		const category = await prisma.category.findUnique({
			where: { id: categoryId },
		});

		if (!category) {
			return NextResponse.json(
				{ message: `La catégorie '${categoryId}' n'existe pas` },
				{ status: 400 },
			);
		}

		const newArticle = await prisma.article.create({
			data: {
				name: name,
				image: image || '',
				price: price,
				unit: unit,
				description: description || '',
				category: {
					connect: { id: category.id },
				},
			},
			include: {
				category: {
					select: { name: true },
				},
			},
		});

		const articleGetDto: ArticleGetDto = {
			id: newArticle.id,
			name: newArticle.name,
			unit: newArticle.unit,
			price: newArticle.price,
			image: newArticle.image,
			description: newArticle.description || '',
			categoryId: newArticle.categoryId,
			categoryName: newArticle.category.name,
		};

		return NextResponse.json(articleGetDto, { status: 201 });
	} catch (error) {
		if (error instanceof SyntaxError) {
			return NextResponse.json(
				{ message: 'Format JSON invalide' },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ message: "Échec de la création de l'article" },
			{ status: 500 },
		);
	}
}
