'use client';
import { ProductCard } from '@/components/site/products/product-card';
import { useArticleStore } from '@/store/useArticleStore';
import { useCartStore } from '@/store/useCartStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo, useRef } from 'react';
import { Loading } from '../../loading';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../../ui/pagination';
import { AnimatedSection } from '../animations/animated-section';
import type { Category } from '@/types/category';

const MAX_ARTICLES_PER_PAGE = 9;

export default function ProductListing() {
	const { articles, fetchArticles, totalArticles, isLoading } = useArticleStore();
	const { categories, fetchCategories } = useCategoryStore();
	const { addCartItem } = useCartStore();

	// 🔥 Synchronisation avec l’URL
	const [categorySlug, setCategorySlug] = useQueryState<string | null>('category', {
		defaultValue: null,
		parse: (v) => v ?? null,
		serialize: (v) => v ?? '',
	});

	const [page, setPage] = useQueryState<number>('page', {
		defaultValue: 1,
		parse: (v) => Number(v) || 1,
		serialize: (v) => String(v),
	});

	const pageSize = MAX_ARTICLES_PER_PAGE;
	const totalPages = Math.ceil(totalArticles / pageSize);

	// Charger les catégories au départ (une seule fois)
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	// Catégorie sélectionnée déduite de l'URL et de la liste
	const selectedCategory: Category | null = useMemo(() => {
		if (!categorySlug) return null;
		return categories.find(c => c.name === categorySlug) ?? null;
	}, [categorySlug, categories]);

	// Quand la catégorie change, réinitialiser la page (sauf au premier rendu)
	const didMountRef = useRef(false);
	useEffect(() => {
		if (!didMountRef.current) {
			didMountRef.current = true;
			return;
		}
		setPage(1);
	}, [categorySlug, setPage]);

	// Charger les articles une fois que la catégorie (si présente) est résolue
	useEffect(() => {
		// Si slug présent mais catégories pas encore chargées, attendre
		if (categorySlug && categories.length === 0) return;
		fetchArticles(selectedCategory?.id, page, pageSize);
	}, [categorySlug, categories.length, selectedCategory?.id, page, pageSize, fetchArticles]);

	// 🧭 Gestion des interactions
	const handleCategoryClick = (category: Category | null) => {
		setCategorySlug(category ? category.name : null);
		setPage(1);
	};


	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
		}
	};

	return (
		<div>
			{/* Catégories */}
			<div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/30">
				<div className="container mx-auto px-6 py-6">
					<div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
						<button
							onClick={() => handleCategoryClick(null)}
							className={`whitespace-nowrap text-sm md:text-base font-light tracking-wide transition-all duration-300 ${selectedCategory === null
								? 'text-foreground border-b-2 border-foreground pb-1'
								: 'text-muted-foreground hover:text-foreground pb-1'
								}`}
						>
							Tous les produits
						</button>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => handleCategoryClick(category)}
							className={`whitespace-nowrap text-sm md:text-base font-light tracking-wide transition-all duration-300 ${selectedCategory?.id === category.id
								? 'text-foreground border-b-2 border-foreground pb-1'
								: 'text-muted-foreground hover:text-foreground pb-1'
								}`}
						>
							{category.name}
						</button>
					))}
					</div>
				</div>
			</div>

			{/* Articles */}
			{isLoading ? (
				<Loading />
			) : articles.length === 0 ? (
				<div className="flex justify-center items-center h-40">
					<p>Aucun article trouvé pour cette catégorie</p>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{articles.map((article) => (
						<AnimatedSection key={article.id}>
							<ProductCard
								article={article}
								onAddToCart={() => addCartItem(article)}
							/>
						</AnimatedSection>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="mt-8 flex justify-center">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									onClick={(e) => {
										e.preventDefault();
										handlePageChange(page - 1);
									}}
									className={page === 1 ? 'pointer-events-none opacity-50' : ''}
								/>
							</PaginationItem>
							{Array.from({ length: totalPages }, (_, index) => (
								<PaginationItem key={index}>
									<PaginationLink
										href="#"
										isActive={page === index + 1}
										onClick={(e) => {
											e.preventDefault();
											handlePageChange(index + 1);
										}}
									>
										{index + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									href="#"
									onClick={(e) => {
										e.preventDefault();
										handlePageChange(page + 1);
									}}
									className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
