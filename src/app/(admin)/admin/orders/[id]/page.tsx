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
import { getStatusStep } from "@/lib/helpers/orderHelpers"
import { useOrderStore } from "@/store/useOrderStore"
import { ArrowLeft, Calendar, Clock, Euro, Pen, ShoppingBasket, SquareX, Trash, User } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"


export default function OrderDetailPage() {
  const { id } = useParams()
  const { orderDetails, fetchOrderDetails, deleteOrder, isLoading, error } = useOrderStore()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchOrderDetails(Number(id));
  }, [id, fetchOrderDetails]);

  const handleDelete = async () => {
    const success = await deleteOrder(Number(id));
    if (success) {
      router.push(`/admin/orders`);
      toast({
        title: "Succès",
        description: "Commande supprimée avec succès",
      });
    }
  };


  if (isLoading) {
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

  if (!orderDetails) {
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
          <h1 className="text-2xl font-bold">Commande #{orderDetails.id}</h1>
          <OrderStatusBadge status={orderDetails.status as "PENDING" | "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED"} />
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
        <CardContent>{getStatusStep(orderDetails.status as "PENDING" | "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED")}</CardContent>
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
                <span className="font-medium">{orderDetails.customerName}</span>
              </div>
              {orderDetails.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{orderDetails.customerEmail}</span>
                </div>
              )}
              {orderDetails?.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span className="font-medium">{orderDetails.customerPhone}</span>
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
                <span className="font-medium">#{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium flex items-center">
                  {orderDetails.total} <Euro className="ml-1 h-4 w-4" />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Articles</span>
                <span className="font-medium">{orderDetails.items?.length || 0}</span>
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
                  {orderDetails.date ? new Date(orderDetails.date).toLocaleDateString() : "N/A"}
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
                {orderDetails.items?.map((item) => (
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
          <div className="font-bold text-lg">{orderDetails.total} €</div>
        </CardFooter>
      </Card>

      {orderDetails.note && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notes et commentaires</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={orderDetails.note} disabled />
          </CardContent>
        </Card>
      )}

    </div>
  )
}

