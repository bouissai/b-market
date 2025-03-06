import { db } from '@/app/lib/db';
import { OrderDetailsDTO, ordersDTO, OrderStatus } from '@/types/order';


// Récupérer toutes les commandes et les formatter en `ordersDTO`
export async function getAllOrders(): Promise<ordersDTO[]> {

  try {
    const orders = await db.order.findMany({
      include: {
        orderItems: true,
        user: true,
      },
    });

    const formattedOrders = orders.map((order) => {
      const formattedOrder = {
        id: order.id,
        customerName: order.user?.name || "Inconnu",
        total: order.total,
        nbArticles: order.orderItems.length,
        status: order.status as keyof typeof OrderStatus,
      };
      return formattedOrder;
    });

    return formattedOrders;
  } catch (error) {
    throw new Error("Impossible de récupérer les commandes.");
  }
}

// Récupérer une commande par ID et retourner un `OrderDetailsDTO`
export async function getOrderById(
  id: number,
): Promise<OrderDetailsDTO | null> {

  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            article: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return null;
    }


    const formattedOrder: OrderDetailsDTO = {
      id: order.id,
      customerName: order.user?.name ?? "Inconnu",
      customerEmail: order.user.email,
      customerPhone: order.user?.phone ?? "Non renseigné", // Utiliser le champ phone du modèle
      date: order.createdAt,
      total: order.total,
      status: order.status,
      note: order.note,
      items: order.orderItems.map((item) => ({
        id: item.id,
        name: item.article?.name ?? "Article inconnu",
        quantity: item.quantity,
        price: item.price,
      })),
    };


    return formattedOrder;
  } catch (error) {
    console.error(`❌ [getOrderById] Erreur lors de la récupération de la commande avec ID ${id}:`, error);
    throw new Error("Impossible de récupérer la commande.");
  }
}

// Mise à jour du statut d'une commande
export async function updateOrderStatus(
  orderId: number,
  newStatus: 'pending' | 'awaiting_payment' | 'completed' | 'cancelled',
) {
  return db.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
}

interface OrderItemInput {
  articleId: string;
  quantity: number;
  price: number;
}

// Création d'une commande avec formatage DTO
export async function createOrder(
  userId: string,
  status: string,
  note: string,
  orderItems: OrderItemInput[],
): Promise<OrderDetailsDTO> {
  
  const total = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const newOrder = await db.order.create({
    data: {
      userId,
      status,
      note,
      total,
      orderItems: {
        create: orderItems.map((item) => ({
          articleId: item.articleId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      orderItems: {
        include: {
          article: true,
        },
      },
      user: true,
    },
  });

  return {
    id: newOrder.id,
    customerName: newOrder.user.name,
    customerEmail: newOrder.user.email,
    customerPhone: "+33 6 95 50 90 33",
    date: newOrder.createdAt,
    total: newOrder.total,
    status: newOrder.status,
    note: newOrder.note,
    items: newOrder.orderItems.map((item) => ({
      id: item.id,
      name: item.article.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}

// Suppression d'une commande
export async function deleteOrder(id: number): Promise<void> {
  await db.order.delete({ where: { id } });
}

// Récupération des commandes d'un utilisateur
export async function getOrdersByUserId(userId: string): Promise<ordersDTO[]> {
  const orders = await db.order.findMany({
    where: { userId },
    include: {
      orderItems: true,
      user: true,
    },
  });

  return orders.map((order) => ({
    id: order.id,
    customerName: order.user.name,
    total: order.total,
    nbArticles: order.orderItems.length,
    status: order.status as keyof typeof OrderStatus,
  }));
}
