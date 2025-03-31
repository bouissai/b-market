"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Clock, MapPin, Phone, ChevronRight, Minus, Plus, User, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Loading } from "@/components/loading"

// Types
interface Product {
    id: string
    name: string
    price: number
    category: string
    image: string
}

interface CartItem {
    product: Product
    quantity: number
}

// Sample products data
const products: Product[] = [
    { id: "1", name: "Entrecôte", price: 28.9, category: "beef", image: "/placeholder.svg?height=300&width=400" },
    { id: "2", name: "Filet de Bœuf", price: 39.9, category: "beef", image: "/placeholder.svg?height=300&width=400" },
    { id: "3", name: "Côte de Bœuf", price: 32.5, category: "beef", image: "/placeholder.svg?height=300&width=400" },
    { id: "4", name: "Bavette d'Aloyau", price: 24.9, category: "beef", image: "/placeholder.svg?height=300&width=400" },
    { id: "5", name: "Côtes de Porc", price: 16.9, category: "pork", image: "/placeholder.svg?height=300&width=400" },
    { id: "6", name: "Filet Mignon", price: 22.9, category: "pork", image: "/placeholder.svg?height=300&width=400" },
    { id: "7", name: "Poulet Fermier", price: 12.9, category: "poultry", image: "/placeholder.svg?height=300&width=400" },
    { id: "8", name: "Gigot d'Agneau", price: 29.9, category: "lamb", image: "/placeholder.svg?height=300&width=400" },
]

export default function PanierPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [cart, setCart] = useState<CartItem[]>([])
    const [activeCategory, setActiveCategory] = useState("beef")
    const [deliveryMethod, setDeliveryMethod] = useState("pickup")
    const [step, setStep] = useState(1)

    // Calculate cart total
    const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

    // Add to cart function
    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id)

            if (existingItem) {
                return prevCart.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
                )
            } else {
                return [...prevCart, { product, quantity: 1 }]
            }
        })
    }

    // Update quantity function
    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
        } else {
            setCart((prevCart) =>
                prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)),
            )
        }
    }

    // Remove from cart function
    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
    }

    // Filter products by category
    const filteredProducts = products.filter((product) => product.category === activeCategory)

    // If loading
    if (status === "loading") {
      return <Loading />;
    }

    // If not authenticated
    if (status === "unauthenticated") {
        return (
            <div className="flex min-h-screen flex-col">
                <main className="flex-1 container py-64">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-8 space-y-4">
                            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h1 className="text-2xl font-bold tracking-tight">Connexion requise</h1>
                            <p className="text-muted-foreground mt-2">Vous devez être connecté pour passer une commande</p>
                            <Button><a href="/auth">Me connecter</a></Button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // If authenticated - Order process
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 container p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Commander en ligne</h1>
                    <div className="flex items-center mt-4 text-sm text-muted-foreground">
                        <div className={`flex items-center ${step >= 1 ? "text-primary" : ""}`}>
                            <div
                                className={`rounded-full w-6 h-6 flex items-center justify-center mr-2 ${step >= 1 ? "bg-primary text-white" : "border"}`}
                            >
                                1
                            </div>
                            <span>Sélection</span>
                        </div>
                        <ChevronRight className="mx-2 h-4 w-4" />
                        <div className={`flex items-center ${step >= 2 ? "text-primary" : ""}`}>
                            <div
                                className={`rounded-full w-6 h-6 flex items-center justify-center mr-2 ${step >= 2 ? "bg-primary text-white" : "border"}`}
                            >
                                2
                            </div>
                            <span>Livraison</span>
                        </div>
                        <ChevronRight className="mx-2 h-4 w-4" />
                        <div className={`flex items-center ${step >= 3 ? "text-primary" : ""}`}>
                            <div
                                className={`rounded-full w-6 h-6 flex items-center justify-center mr-2 ${step >= 3 ? "bg-primary text-white" : "border"}`}
                            >
                                3
                            </div>
                            <span>Paiement</span>
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="grid md:grid-cols-3 gap-8">


                        <div className="md:col-span-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-bold">Votre panier</CardTitle>
                                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {cart.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-muted-foreground">Votre panier est vide</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div key={item.product.id} className="flex justify-between items-start pb-4 border-b">
                                                    <div>
                                                        <h4 className="font-medium">{item.product.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{item.product.price.toFixed(2)} €/kg</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm font-medium mt-1">
                                                            {(item.product.price * item.quantity).toFixed(2)} €
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="pt-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Sous-total</span>
                                                    <span>{cartTotal.toFixed(2)} €</span>
                                                </div>
                                                <div className="flex justify-between text-sm mt-2">
                                                    <span>Frais de livraison</span>
                                                    <span>Calculés à l'étape suivante</span>
                                                </div>
                                                <Separator className="my-4" />
                                                <div className="flex justify-between font-bold">
                                                    <span>Total</span>
                                                    <span>{cartTotal.toFixed(2)} €</span>
                                                </div>
                                            </div>

                                            <Button className="w-full mt-4" disabled={cart.length === 0} onClick={() => setStep(2)}>
                                                Continuer
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="md:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nos recommandations</CardTitle>
                                    <CardDescription>Notre selection de produits pour vous</CardDescription>
                                </CardHeader>
                                <CardContent>

                                    <div className="grid gap-2 sm:grid-cols-4">
                                        {filteredProducts.map((product) => (
                                            <Card key={product.id} className="overflow-hidden">
                                                <div className="relative h-40">
                                                    <Image
                                                        src={product.image || "/placeholder.svg"}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold">{product.name}</h3>
                                                        <span className="font-bold text-primary">{product.price.toFixed(2)} €/kg</span>
                                                    </div>
                                                    <Button variant="outline" className="w-full mt-4" onClick={() => addToCart(product)}>
                                                        Ajouter au panier
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                </CardContent>
                            </Card>
                        </div>
                    </div>

                )}

                {step === 2 && (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Livraison</CardTitle>
                                    <CardDescription>Choisissez votre mode de livraison</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-4">
                                        <div
                                            className={`flex items-start space-x-4 border rounded-lg p-4 ${deliveryMethod === "pickup" ? "border-primary" : ""}`}
                                        >
                                            <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor="pickup" className="text-base font-medium flex items-center">
                                                    <Clock className="mr-2 h-5 w-5 text-primary" />
                                                    Retrait en boutique
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Retirez votre commande directement à notre boucherie
                                                </p>
                                                <div className="mt-4 space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="pickup-date">Date de retrait</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionnez une date" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="tomorrow">Demain</SelectItem>
                                                                <SelectItem value="day-after">Après-demain</SelectItem>
                                                                <SelectItem value="later">Plus tard cette semaine</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="pickup-time">Heure de retrait</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionnez une heure" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="morning">9h00 - 12h00</SelectItem>
                                                                <SelectItem value="afternoon">14h00 - 17h00</SelectItem>
                                                                <SelectItem value="evening">17h00 - 19h00</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={`flex items-start space-x-4 border bg-muted rounded-lg p-4 ${deliveryMethod === "delivery" ? "border-primary" : ""}`}
                                        >
                                            <RadioGroupItem disabled value="delivery" id="delivery" className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor="delivery" className="text-base font-medium flex items-center">
                                                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                                                    Livraison à domicile (prochainement)
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Livraison à votre adresse - frais de livraison: 5,00 €
                                                </p>
                                                {deliveryMethod === "delivery" && (
                                                    <div className="mt-4 space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="address">Adresse</Label>
                                                            <Input id="address" placeholder="Numéro et nom de rue" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="postal-code">Code postal</Label>
                                                                <Input id="postal-code" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="city">Ville</Label>
                                                                <Input id="city" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="delivery-instructions">Instructions de livraison (optionnel)</Label>
                                                            <Input id="delivery-instructions" placeholder="Digicode, étage, etc." />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="delivery-date">Date de livraison</Label>
                                                            <Select>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionnez une date" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="tomorrow">Demain</SelectItem>
                                                                    <SelectItem value="day-after">Après-demain</SelectItem>
                                                                    <SelectItem value="later">Plus tard cette semaine</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            <div className="flex justify-between mt-6">
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Retour
                                </Button>
                                <Button onClick={() => setStep(3)}>Continuer vers le paiement</Button>
                            </div>
                        </div>

                        <div>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-bold">Récapitulatif</CardTitle>
                                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div key={item.product.id} className="flex justify-between items-center text-sm">
                                                <span>
                                                    {item.quantity} × {item.product.name}
                                                </span>
                                                <span className="font-medium">{(item.product.price * item.quantity).toFixed(2)} €</span>
                                            </div>
                                        ))}

                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Sous-total</span>
                                                <span>{cartTotal.toFixed(2)} €</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Frais de livraison</span>
                                                <span>{deliveryMethod === "delivery" ? "5,00 €" : "Gratuit"}</span>
                                            </div>
                                            <Separator className="my-2" />
                                            <div className="flex justify-between font-bold">
                                                <span>Total</span>
                                                <span>{(cartTotal + (deliveryMethod === "delivery" ? 5 : 0)).toFixed(2)} €</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Paiement</CardTitle>
                                    <CardDescription>Choisissez votre mode de paiement</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup defaultValue="store" className="space-y-4">
                                        <div className="flex items-start space-x-4 border rounded-lg p-4 bg-muted">
                                            <RadioGroupItem disabled value="card" id="card" className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor="card" className="text-base font-medium">
                                                    Carte bancaire
                                                </Label>
                                                <div className="mt-4 space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="card-number">Numéro de carte</Label>
                                                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="expiry">Date d'expiration</Label>
                                                            <Input id="expiry" placeholder="MM/AA" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="cvc">CVC</Label>
                                                            <Input id="cvc" placeholder="123" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name-on-card">Nom sur la carte</Label>
                                                        <Input id="name-on-card" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 border rounded-lg p-4 bg-muted">
                                            <RadioGroupItem disabled value="paypal" id="paypal" className="mt-1" />
                                            <div>
                                                <Label htmlFor="paypal" className="text-base font-medium">
                                                    PayPal
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Vous serez redirigé vers PayPal pour effectuer le paiement
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 border rounded-lg p-4">
                                            <RadioGroupItem value="store" id="store" className="mt-1" />
                                            <div>
                                                <Label htmlFor="store" className="text-base font-medium">
                                                    Paiement en boutique
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">Payez lors du retrait de votre commande</p>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            <div className="flex justify-between mt-6">
                                <Button variant="outline" onClick={() => setStep(2)}>
                                    Retour
                                </Button>
                                <Button onClick={() => router.push("/confirmation")}>Confirmer la commande</Button>
                            </div>
                        </div>

                        <div>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-bold">Récapitulatif</CardTitle>
                                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div key={item.product.id} className="flex justify-between items-center text-sm">
                                                <span>
                                                    {item.quantity} × {item.product.name}
                                                </span>
                                                <span className="font-medium">{(item.product.price * item.quantity).toFixed(2)} €</span>
                                            </div>
                                        ))}

                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Sous-total</span>
                                                <span>{cartTotal.toFixed(2)} €</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Frais de livraison</span>
                                                <span>{deliveryMethod === "delivery" ? "5,00 €" : "Gratuit"}</span>
                                            </div>
                                            <Separator className="my-2" />
                                            <div className="flex justify-between font-bold">
                                                <span>Total</span>
                                                <span>{(cartTotal + (deliveryMethod === "delivery" ? 5 : 0)).toFixed(2)} €</span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="rounded-lg bg-muted p-4">
                                                <div className="flex items-start mb-2">
                                                    <div
                                                        className={`mr-2 ${deliveryMethod === "pickup" ? "text-primary" : "text-muted-foreground"}`}
                                                    >
                                                        {deliveryMethod === "pickup" ? (
                                                            <Clock className="h-5 w-5" />
                                                        ) : (
                                                            <MapPin className="h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {deliveryMethod === "pickup" ? "Retrait en boutique" : "Livraison à domicile"}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {deliveryMethod === "pickup"
                                                                ? "B-Market, 123 Rue de la Boucherie, 75001 Paris"
                                                                : "À votre adresse"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>


        </div>
    )
}
