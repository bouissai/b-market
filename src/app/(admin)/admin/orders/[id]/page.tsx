"use client"

import OrderStatusBadge from "@/components/admin/orderAdmin/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useOrders } from "@/hooks/useOrders"
import { getStatusStep } from "@/lib/helpers/orderHelpers"
import { type OrderDetailsDTO } from "@/types/order"
import { ArrowLeft, Calendar, Clock, Euro, Pen, ShoppingBasket, SquareX, Trash, User } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function OrderDetailPage() {
  const { id } = useParams()
  const { fetchOrderDetails, deleteOrder } = useOrders()
  const [order, setOrder] = useState<OrderDetailsDTO>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return; // Vérifier si id est bien défini

    const numericId = Number(id); // Convertir id en number
    if (isNaN(numericId)) {
      setError("ID de commande invalide.");
      return;
    }

    const getOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderDetails(numericId); // Passer l'ID en number
        setOrder(data);
      } catch {
        setError("Erreur lors de la récupération de la commande.");
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [id, fetchOrderDetails]);



  const handleDelete = async () => {
    if (!id) return;

    const numericId = Number(id);
    if (isNaN(numericId)) {
      toast({
        title: "Erreur",
        description: "ID de commande invalide.",
        variant: "destructive",
      });
      return;
    }

    const success = await deleteOrder(numericId);
    if (success) {
      router.push(`/admin/orders`);
      toast({
        title: "Succès",
        description: "Commande supprimée avec succès",
      });
    }
  };


  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center text-center p-6">
          <div className="p-3 mb-4">
            <SquareX className="h-6 w-6 text-red-600" />
          </div>
          <h3>Erreur</h3>
          <p>{error}</p>
          <Button variant="outline" onClick={() => router.push("/admin/orders")} className="mt-4">
            Retour aux commandes
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => router.push("/admin/orders")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux commandes
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <ShoppingBasket className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Commande introuvable</h3>
              <p className="text-muted-foreground mt-2">Cette commande n'existe pas ou a été supprimée.</p>
              <Button onClick={() => router.push("/admin/orders")} className="mt-4">
                Voir toutes les commandes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex content-center justify-center items-center center gap-6">
          <h1 className="text-2xl font-bold">Commande #{order.id}</h1>
          <OrderStatusBadge status={order.status as "PENDING" | "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED"} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => console.log("TODO edit")} variant="outline" size="sm">
            <Pen className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
              >
                <Trash className="mr-2 h-4 w-4" /> Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette commande ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela annulera définitivement la commande.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-700 text-white" onClick={handleDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Progression de la commande */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Statut de la commande</span>
          </CardTitle>
        </CardHeader>
        <CardContent>{getStatusStep(order.status as "PENDING" | "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED")}</CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations client */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" /> Informations client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              {order.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{order.customerEmail}</span>
                </div>
              )}
              {order?.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Détails de la commande */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBasket className="mr-2 h-5 w-5" /> Détails de la commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Numéro</span>
                <span className="font-medium">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium flex items-center">
                  {order.total} <Euro className="ml-1 h-4 w-4" />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Articles</span>
                <span className="font-medium">{order.items?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de livraison/retrait */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Informations temporelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date de commande</span>
                <span className="font-medium flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des produits */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBasket className="mr-2 h-5 w-5" /> Produits commandés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Produit</th>
                  <th className="text-right py-3 px-4 font-medium">Prix unitaire</th>
                  <th className="text-right py-3 px-4 font-medium">Quantité</th>
                  <th className="text-right py-3 px-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="text-right py-3 px-4">{item.price} €</td>
                    <td className="text-right py-3 px-4">{item.quantity}</td>
                    <td className="text-right py-3 px-4">{(item.price * item.quantity).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="font-medium">Total</div>
          <div className="font-bold text-lg">{order.total} €</div>
        </CardFooter>
      </Card>


      {order.note && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notes et commentaires</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={order.note} disabled />
          </CardContent>
        </Card>
      )}

    </div>
  )
}

