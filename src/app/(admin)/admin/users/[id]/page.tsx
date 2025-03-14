"use client";

import { useUserStore } from "@/store/useUserStore";
import { orderDTO } from "@/types/order";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDetailsPage() {
  const params = useParams(); // Récupération des paramètres dynamiques
  const [userId, setUserId] = useState<string | null>(null); // Gestion de l'ID utilisateur
  const { fetchOrdersByUserID, userOrders } = useUserStore();

  useEffect(() => {
    if (params?.id) { // Utilisation de `id` au lieu de `userId`
      console.log("🔹 userId récupéré :", params.id);
      setUserId(params.id as string);
      fetchOrdersByUserID(params.id as string);
    } else {
      console.warn("⚠️ userId est undefined, vérifiez la route !");
    }
  }, [params?.id, fetchOrdersByUserID]);
  console.log(userOrders)
  return (
    <div>
      <h2>Commandes de l'utilisateur</h2>
      {userOrders.length > 0 ? (
        <ul>
          {userOrders.map((order: orderDTO) => (
            <li key={order.id}>{order.id}</li>
          ))}
        </ul>
      ) : (
        <p>Aucune commande trouvée.</p>
      )}
    </div>
  );
}
