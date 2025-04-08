'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useArticleStore } from '@/store/useArticleStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from './ui/pagination';
import { Loading } from './loading';
import { useCartStore } from '@/store/useCartStore';

const MAX_ARTICLES_PER_PAGE = 9;

export default function ProductListing() {
	const { articles, fetchArticles, totalArticles, isLoading, error } =
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
	}, []);

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
			<div className="mb-6">
				<div className="flex flex-wrap gap-2">
					<Button
						variant={selectedCategory === null ? 'default' : 'outline'}
						onClick={() => setSelectedCategory(null, null)}>
						Tout
					</Button>
					{categories.map(category => (
						<Button
							key={category.id}
							variant={
								selectedCategory === category ? 'default' : 'outline'
							}
							onClick={() => setSelectedCategory(category, null)}>
							{category.name}
						</Button>
					))}
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
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{articles.map(article => (
						<Card key={article.id} className="overflow-hidden">
							<div className="aspect-video relative">
								<Image
									src={article.image}
									alt={article.name}
									loading="lazy"
									quality={75}
									fill
									className="object-cover"
								/>
							</div>
							<CardHeader>
								<CardTitle className="flex justify-between items-center">
									<span>{article.name}</span>
									<span className="text-lg font-bold">
										{article.price.toFixed(2)}€ / {article.unit}
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									{article.description}
								</p>
								<Badge className="mt-2">{article.categoryName}</Badge>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button onClick={() => addCartItem(article)}>
									Ajouter au panier
								</Button>
							</CardFooter>
						</Card>
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
