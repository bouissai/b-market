'use client';

import { useState } from 'react';
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

// Product type definition
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    description: 'High-quality product with premium materials',
    price: 29.99,
    image: '/placeholder.svg?height=200&width=200',
    category: 'Bedroom',
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Elegant design with durable construction',
    price: 39.99,
    image: '/placeholder.svg?height=200&width=200',
    category: 'Living Room',
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'Modern style with comfortable feel',
    price: 49.99,
    image: '/placeholder.svg?height=200&width=200',
    category: 'Bedroom',
  },
  {
    id: 4,
    name: 'Product 4',
    description: 'Classic design that never goes out of style',
    price: 59.99,
    image: '/placeholder.svg?height=200&width=200',
    category: 'Kitchen',
  },
  {
    id: 5,
    name: 'Product 5',
    description: 'Innovative features with sleek appearance',
    price: 69.99,
    image: '/placeholder.svg?height=200&width=200',
    category: 'Living Room',
  },
  {
    id: 6,
    name: 'Product 6',
    description: 'Versatile product for multiple uses',
    price: 79.99,
    image: '/placeholder.svg?height=200&width=200',
    category: 'Kitchen',
  },
];

// Get unique categories from products
const categories = Array.from(
  new Set(products.map((product) => product.category)),
);

// Cart item type
type CartItem = {
  product: Product;
  quantity: number;
};

export default function ProductListing() {
  // State for cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Function to add product to cart
  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        // Update quantity if product already in cart
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        // Add new product to cart
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Function to remove product from cart
  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  // Function to update quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // Calculate total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add this to the component, after the totalItems calculation but before the return statement
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Products</h2>
        <Sheet>
          <SheetDescription/>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              {cartItems.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          src={item.product.image || '/placeholder.svg'}
                          alt={item.product.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
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
                            updateQuantity(item.product.id, item.quantity + 1)
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
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* If no category is selected, show products grouped by category */}
      {selectedCategory === null ? (
        <>
          {Object.entries(productsByCategory).map(
            ([category, categoryProducts]) => (
              <div key={category} className="mb-10">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>{product.name}</span>
                          <span className="text-lg font-bold">
                            ${product.price.toFixed(2)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {product.description}
                        </p>
                        <Badge className="mt-2">{product.category}</Badge>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              const item = cartItems.find(
                                (item) => item.product.id === product.id,
                              );
                              const currentQuantity = item ? item.quantity : 0;
                              if (currentQuantity > 0) {
                                updateQuantity(product.id, currentQuantity - 1);
                              }
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>
                            {cartItems.find(
                              (item) => item.product.id === product.id,
                            )?.quantity || 0}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              const item = cartItems.find(
                                (item) => item.product.id === product.id,
                              );
                              const currentQuantity = item ? item.quantity : 0;
                              updateQuantity(product.id, currentQuantity + 1);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button onClick={() => addToCart(product)}>
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          )}
        </>
      ) : (
        // If a category is selected, show only products from that category
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <span className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{product.description}</p>
                <Badge className="mt-2">{product.category}</Badge>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const item = cartItems.find(
                        (item) => item.product.id === product.id,
                      );
                      const currentQuantity = item ? item.quantity : 0;
                      if (currentQuantity > 0) {
                        updateQuantity(product.id, currentQuantity - 1);
                      }
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>
                    {cartItems.find((item) => item.product.id === product.id)
                      ?.quantity || 0}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const item = cartItems.find(
                        (item) => item.product.id === product.id,
                      );
                      const currentQuantity = item ? item.quantity : 0;
                      updateQuantity(product.id, currentQuantity + 1);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={() => addToCart(product)}>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
