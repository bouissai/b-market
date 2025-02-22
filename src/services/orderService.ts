import { db } from "@/app/lib/db";
import { OrderDetailsDTO } from "@/types/order";
import { Order } from "@prisma/client";


export async function getAllOrders(): Promise<Order[]> {
    return db.order.findMany({
        include: {
            orderItems: {
                include: {
                    article: true // Inclure l'article pour chaque orderItem
                }
            },
            user: true // Inclure l'utilisateur
        }
    });
}


export async function updateOrderStatus(orderId: string, newStatus: "pending" | "awaiting_payment" | "completed" | "cancelled") {
    return db.order.update({
        where: {id: orderId},
        data: {status: newStatus},
    });
}

export async function getOrderById(id: string): Promise<OrderDetailsDTO | null> {
    const order = await db.order.findUnique({
        where: {id},
        include: {
            orderItems: {
                include: {
                    article: true
                }
            },
            user: true
        }
    });

    if (!order) {
        return null;
    }
    return {id: order.id, customerName: order.user.name, total: order.total, status: order.status, items: order.orderItems.map((item) => ({
        id: item.id,   // ✅ Ajout de l'id de l'item
        name: item.article.name,
        quantity: item.quantity,
        price: item.price
    }))};
}


interface OrderItemInput {
    articleId: string;
    quantity: number;
    price: number;
}

// ✅ Créer une commande avec ses `orderItems` en cascade
export async function createOrder(userId: string, status: string, orderItems: OrderItemInput[]): Promise<Order> {
    // Calcul du total basé sur les articles envoyés
    const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return db.order.create({
        data: {
            userId,
            status,
            total, // ✅ Mise à jour automatique du total
            orderItems: {
                create: orderItems.map((item) => ({
                    articleId: item.articleId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
        include: {orderItems: true},
    });
}

export async function deleteOrder(id: string): Promise<void> {
    await db.order.delete({where: {id}});
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
    return db.order.findMany({where: {userId}, include: {orderItems: true}});
}