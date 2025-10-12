'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useArticleStore } from '@/store/useArticleStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../../ui/pagination';
import { Loading } from '../../loading';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/site/products/product-card';

const MAX_ARTICLES_PER_PAGE = 9;

export default function ProductListing() {
	const { articles, fetchArticles, totalArticles, isLoading } =
		useArticleStore();
	const {
		categories,
		fetchCategories,
		selectedCategory,
		setSelectedCategory,
	} = useCategoryStore();
	const { addCartItem } = useCartStore();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = MAX_ARTICLES_PER_PAGE;
	const totalPages = Math.ceil(totalArticles / pageSize);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	// récupération des articles selon la catégorie sélectionnée
	useEffect(() => {
		fetchArticles(selectedCategory?.id, currentPage, pageSize);
	}, [selectedCategory, currentPage, pageSize, fetchArticles]);

	// reset current page quand la catégorie est changée
	useEffect(() => {
		if (selectedCategory !== null) {
			setCurrentPage(1);
		}
	}, [selectedCategory]);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	return (
		<div>
			{/* Category filter buttons */}
			<div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/30">
				<div className="container mx-auto px-6 py-6">
				<div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
				{/* Bouton "Tout" pour afficher tous les articles */}
				<button
					onClick={() => setSelectedCategory(null, null)}
					className={`
					  whitespace-nowrap text-sm md:text-base font-light tracking-wide transition-all duration-300
					  ${
						selectedCategory === null
						  ? "text-foreground border-b-2 border-foreground pb-1"
						  : "text-muted-foreground hover:text-foreground pb-1"
					  }
					`}
				>
					Tous les produits
				</button>
				{categories.map((category) => (
				<button
				key={category.id}
				onClick={() => setSelectedCategory(category,null)}
				className={`
				  whitespace-nowrap text-sm md:text-base font-light tracking-wide transition-all duration-300
				  ${
					selectedCategory?.id === category.id
					  ? "text-foreground border-b-2 border-foreground pb-1"
					  : "text-muted-foreground hover:text-foreground pb-1"
				  }
				`}
			  >
				{category.name}
			  </button>
				))}
					</div>
				</div>
			</div>

			{/* Show articles */}
			{isLoading ? (
				<Loading />
			) : articles.length === 0 ? (
				<div className="flex justify-center items-center h-40">
					<p>Aucun article trouvé pour cette catégorie</p>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{articles.map(article => (
						<ProductCard
							key={article.id}
							article={article}
							onAddToCart={() => addCartItem(article)}
						/>
					))}
				</div>
			)}

			{/* Show pagination*/}
			{totalPages > 1 && (
				<div className="mt-8 flex justify-center">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									onClick={e => {
										e.preventDefault();
										handlePageChange(currentPage - 1);
									}}
									className={
										currentPage === 1
											? 'pointer-events-none opacity-50'
											: ''
									}
								/>
							</PaginationItem>
							{Array.from({ length: totalPages }, (_, index) => (
								<PaginationItem key={index}>
									<PaginationLink
										href="#"
										isActive={currentPage === index + 1}
										onClick={e => {
											e.preventDefault();
											handlePageChange(index + 1);
										}}>
										{index + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									href="#"
									onClick={e => {
										e.preventDefault();
										handlePageChange(currentPage + 1);
									}}
									className={
										currentPage === totalPages
											? 'pointer-events-none opacity-50'
											: ''
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
