import { Order } from "@/types/order";
import { useEffect, useState } from "react";

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try{
            setIsLoading(true);
            const response = await fetch("/api/order");
            if(!response.ok) throw new Error("Failed to fetch orders");
            const data = await response.json();
            setOrders(data);
        }catch(err){
            setError(err instanceof Error ? err.message : "An error occurred");
        }finally{
            setIsLoading(false);
        }
    };

    const addOrder = (newOrder: Order) => {
        setOrders([...orders, newOrder]);
    };

    const updateOrder = (updatedOrder: Order) => {
        setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    };

    const saveOrder = async (order: Order, method: "POST" | "PUT", url: string) => {
        setIsSubmitting(true);
        try{
            const response = await fetch(url, {
                method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(order),
            });

            if(!response.ok){
                const errorResponse = await response.json();
                throw {status: response.status, message: errorResponse.message || "Unknown error"};
            }

            return await response.json();
        }catch(err){
            setError(err instanceof Error ? err.message : "An error occurred");
        }finally{
            setIsSubmitting(false);
        }
    };

    const deleteOrder = async (id: string) => {
        await fetch(`/api/orders/${id}`, {method: "DELETE"});
    };


    return {
        orders,
        isLoading,
        error,
        isSubmitting,
        addOrder,
        updateOrder,
        saveOrder,
        deleteOrder,
        fetchOrders
    }
    
}