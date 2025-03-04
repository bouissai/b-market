import { db } from '@/app/lib/db';
import { OrderDetailsDTO, ordersDTO, OrderStatus } from '@/types/order';

// Récupérer toutes les commandes et les formatter en `ordersDTO`
export async function getAllOrders(): Promise<ordersDTO[]> {
  const orders = await db.order.findMany({
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

// Récupérer une commande par ID et retourner un `OrderDetailsDTO`
export async function getOrderById(
  id: string,
): Promise<OrderDetailsDTO | null> {
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

  if (!order) return null;

  return {
    id: order.id,
    customerName: order.user.name,
    total: order.total,
    status: order.status,
    items: order.orderItems.map((item) => ({
      id: item.id,
      name: item.article.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}

// Mise à jour du statut d'une commande
export async function updateOrderStatus(
  orderId: string,
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
    total: newOrder.total,
    status: newOrder.status,
    items: newOrder.orderItems.map((item) => ({
      id: item.id,
      name: item.article.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}

// Suppression d'une commande
export async function deleteOrder(id: string): Promise<void> {
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
