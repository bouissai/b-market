"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Settings, Heart, CreditCard, MapPin, AlertCircle, Calendar, Search } from "lucide-react"
import Link from "next/link"

// Types
interface Order {
  id: string
  orderNumber: string
  date: string
  total: number
  status: "pending" | "processing" | "ready" | "completed" | "cancelled"
  items: {
    name: string
    quantity: number
    price: number
  }[]
  notes?: string
}

// Sample orders data
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "CMD-4872",
    date: "2023-11-15",
    total: 87.5,
    status: "ready",
    items: [
      { name: "Entrecôte", quantity: 2, price: 28.9 },
      { name: "Filet Mignon", quantity: 1, price: 22.9 },
      { name: "Poulet Fermier", quantity: 1, price: 12.9 },
    ],
    notes:
      "Votre commande est prête à être retirée. Nous avons sélectionné une entrecôte particulièrement persillée comme vous le préférez.",
  },
  {
    id: "2",
    orderNumber: "CMD-4756",
    date: "2023-11-02",
    total: 64.3,
    status: "completed",
    items: [
      { name: "Côte de Bœuf", quantity: 1, price: 32.5 },
      { name: "Côtes de Porc", quantity: 2, price: 16.9 },
    ],
  },
  {
    id: "3",
    orderNumber: "CMD-4921",
    date: "2023-11-20",
    total: 105.7,
    status: "processing",
    items: [
      { name: "Filet de Bœuf", quantity: 2, price: 39.9 },
      { name: "Gigot d'Agneau", quantity: 1, price: 29.9 },
    ],
    notes:
      "Votre commande est en cours de préparation. Notre boucher prépare votre filet de bœuf selon vos préférences.",
  },
  {
    id: "4",
    orderNumber: "CMD-4699",
    date: "2023-10-18",
    total: 49.8,
    status: "completed",
    items: [{ name: "Bavette d'Aloyau", quantity: 2, price: 24.9 }],
  },
  {
    id: "5",
    orderNumber: "CMD-4985",
    date: "2023-11-25",
    total: 78.6,
    status: "pending",
    items: [
      { name: "Entrecôte", quantity: 1, price: 28.9 },
      { name: "Filet Mignon", quantity: 1, price: 22.9 },
      { name: "Côtes de Porc", quantity: 1, price: 16.9 },
      { name: "Poulet Fermier", quantity: 1, price: 12.9 },
    ],
  },
]

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("fr-FR", options)
}

// Status badge component
const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const statusConfig = {
    pending: { label: "En attente", variant: "outline" as const },
    processing: { label: "En préparation", variant: "secondary" as const },
    ready: { label: "Prêt à retirer", variant: "default" as const },
    completed: { label: "Terminée", variant: "success" as const },
    cancelled: { label: "Annulée", variant: "destructive" as const },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

export default function MonComptePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter orders based on search term
  const filteredOrders = sampleOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // If loading
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-12">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // If not authenticated
  if (status === "unauthenticated") {
    router.push("/commander")
    return null
  }

  // If authenticated
  return (
    <div className="flex min-h-screen p-4 flex-col">


      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src="/placeholder.svg" alt={session?.user?.name || "Utilisateur"} />
                    <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{session?.user?.name || "Utilisateur"}</h2>
                  <p className="text-sm text-muted-foreground">{session?.user?.email || "utilisateur@exemple.com"}</p>
                </div>

                <nav className="space-y-1">
                  <Link
                    href="/mon-compte"
                    className="flex items-center py-2 px-3 rounded-md bg-primary/10 text-primary font-medium"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Mes commandes
                  </Link>
                  <Link
                    href="/mon-compte/favoris"
                    className="flex items-center py-2 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Favoris
                  </Link>
                  <Link
                    href="/mon-compte/adresses"
                    className="flex items-center py-2 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Adresses
                  </Link>
                  <Link
                    href="/mon-compte/parametres"
                    className="flex items-center py-2 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Informations personnelles
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Mes commandes</h1>
              <p className="text-muted-foreground mt-1">Consultez l'historique et le statut de vos commandes</p>
            </div>

            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une commande..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="processing">En préparation</TabsTrigger>
                <TabsTrigger value="ready">Prêtes</TabsTrigger>
                <TabsTrigger value="completed">Terminées</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-4">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">Commande {order.orderNumber}</h3>
                                  <StatusBadge status={order.status} />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(order.date)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className="font-bold">{order.total.toFixed(2)} €</p>
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/mon-compte/commandes/${order.id}`}>Détails</Link>
                                </Button>
                              </div>
                            </div>

                            <div className="text-sm">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="flex justify-between py-1">
                                  <span>
                                    {item.quantity} × {item.name}
                                  </span>
                                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-muted-foreground text-xs mt-1">
                                  + {order.items.length - 2} autres produits
                                </div>
                              )}
                            </div>
                          </div>

                          {order.notes && (
                            <div className="bg-muted p-4 border-t">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-sm">Note du commerçant</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{order.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Aucune commande trouvée</h3>
                      <p className="text-muted-foreground mt-1">
                        {searchTerm
                          ? "Aucune commande ne correspond à votre recherche"
                          : "Vous n'avez pas encore passé de commande"}
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/commander">Commander maintenant</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Other tabs would filter by status */}
              <TabsContent value="pending">
                <div className="space-y-4">
                  {filteredOrders.filter((order) => order.status === "pending").length > 0 ? (
                    filteredOrders
                      .filter((order) => order.status === "pending")
                      .map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          {/* Same card content as above */}
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">Commande {order.orderNumber}</h3>
                                    <StatusBadge status={order.status} />
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(order.date)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <p className="font-bold">{order.total.toFixed(2)} €</p>
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={`/mon-compte/commandes/${order.id}`}>Détails</Link>
                                  </Button>
                                </div>
                              </div>

                              <div className="text-sm">
                                {order.items.slice(0, 2).map((item, index) => (
                                  <div key={index} className="flex justify-between py-1">
                                    <span>
                                      {item.quantity} × {item.name}
                                    </span>
                                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                  </div>
                                ))}
                                {order.items.length > 2 && (
                                  <div className="text-muted-foreground text-xs mt-1">
                                    + {order.items.length - 2} autres produits
                                  </div>
                                )}
                              </div>
                            </div>

                            {order.notes && (
                              <div className="bg-muted p-4 border-t">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                                  <div>
                                    <h4 className="font-medium text-sm">Note du commerçant</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{order.notes}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Aucune commande en attente</h3>
                      <p className="text-muted-foreground mt-1">
                        Vous n'avez pas de commande en attente pour le moment
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/commander">Commander maintenant</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Similar content for other tabs */}
              <TabsContent value="processing">
                {/* Similar content as "pending" tab but filtered for processing orders */}
              </TabsContent>
              <TabsContent value="ready">
                {/* Similar content as "pending" tab but filtered for ready orders */}
              </TabsContent>
              <TabsContent value="completed">
                {/* Similar content as "pending" tab but filtered for completed orders */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

    </div>
  )
}

