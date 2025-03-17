'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useArticleStore } from '@/store/useArticleStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Article } from '@prisma/client';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

// Cart item type
type CartItem = {
  article: Article;
  quantity: number;
};

export default function ProductListing() {
  const { articles, fetchArticles, totalArticles, isLoading, error } = useArticleStore();
  const { categories, fetchCategories, selectedCategory, setSelectedCategory} = useCategoryStore();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Nombre d'articles par page
  const totalPages = Math.ceil(totalArticles / pageSize);

  // récupération des catégories
  useEffect(() => { 
    fetchCategories();  
  }, []);

  // récupération des articles selon la catégorie sélectionnée
  useEffect(() => {
    fetchArticles(selectedCategory?.name, currentPage, pageSize);
  }, [selectedCategory, currentPage, pageSize, fetchArticles]);

  // reset current page quand la catégorie est changée
  useEffect(() => {
    if (selectedCategory !== null) {
      setCurrentPage(1);
    }
  }, [selectedCategory]);

  // gestion de la navigation entre les pages
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to add product to cart
  const addToCart = (article: Article, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.article.id === article.id,
      );

      if (existingItem) {
        // Update quantity if product already in cart
        return prevItems.map((item) =>
          item.article.id === article.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        // Add new product to cart
        return [...prevItems, { article: article, quantity }];
      }
    });
  };

  // Function to remove product from cart
  const removeFromCart = (articleId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.article.id !== articleId.toString()),
    );
  };

  // Function to update quantity
  const updateQuantity = (articleId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.article.id === articleId.toString()
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.article.price * item.quantity,
    0,
  );

  // Calculate total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>

      {/* Show card */}
      <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-xl font-semibold">All Products</h2> */}
        <Sheet>
          <SheetDescription/>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Mon panier
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Votre panier</SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              {cartItems.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Votre panier est vide
                </p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.article.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          // TODO : a modifier quand il y aura les images des articles
                          // src={article.image && article.image.startsWith('http') ? article.image : '/placeholder.svg'}
                          src={'/images/religieux.webp'}
                          alt={item.article.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-medium">{item.article.name}</p>
                          <p className="text-sm text-muted-foreground">
                            €{item.article.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.article.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.article.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="w-full mt-4">Checkout</Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category filter buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null, null)}
          >
            Tout
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category, null)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Show articles */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Chargement des articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p>Aucun article trouvé pour cette catégorie</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image
                // TODO : a modifier quand il y aura les images des articles
                // src={article.image && article.image.startsWith('http') ? article.image : '/placeholder.svg'}
                src={'/images/religieux.webp'}
                alt={article.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{article.name}</span>
                <span className="text-lg font-bold">
                  {article.price.toFixed(2)}€
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{article.description}</p>
              <Badge className="mt-2">{article.categoryName}</Badge>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const item = cartItems.find(
                      (item) => item.article.id === article.id,
                    );
                    const currentQuantity = item ? item.quantity : 0;
                    if (currentQuantity > 0) {
                      updateQuantity(article.id, currentQuantity - 1);
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>
                  {cartItems.find((item) => item.article.id === article.id)
                    ?.quantity || 0}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const item = cartItems.find(
                      (item) => item.article.id === article.id,
                    );
                    const currentQuantity = item ? item.quantity : 0;
                    updateQuantity(article.id, currentQuantity + 1);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => addToCart(article)}>Ajouter au panier</Button>
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
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === index + 1} 
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
                    handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
