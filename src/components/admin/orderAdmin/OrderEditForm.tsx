"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useOrderStore } from "@/store/useOrderStore";
import { useArticleStore } from "@/store/useArticleStore";
import { OrderDetailsDTO, OrderStatus, OrderStatusKey } from "@/types/order";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  order: OrderDetailsDTO;
};

export default function OrderEditForm({ order }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState(order.note || "");
  const [items, setItems] = useState(order.items || []);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const { articles, fetchArticles } = useArticleStore();
  const { updateOrderDetails, fetchOrderDetails } = useOrderStore();

  useEffect(() => {
    if (open) fetchArticles();
  }, [open, fetchArticles]);

  const handleQuantityChange = (id: string, value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddArticle = () => {
    if (!selectedArticleId) return;

    const alreadyExists = items.some((item) => item.id === selectedArticleId);
    if (alreadyExists) return;

    const article = articles.find((a) => a.id === selectedArticleId);
    if (!article) return;

    setItems((prev) => [
      ...prev,
      {
        id: article.id,
        name: article.name,
        quantity: 1,
        price: article.price,
      },
    ]);
    setSelectedArticleId(null);
  };

  const handleSubmit = async () => {
    const updates: {
      action: "add" | "update" | "delete";
      articleId: string;
      quantity?: number;
    }[] = [];

    const removedItems = order.items.filter(
      (originalItem) => !items.find((i) => i.id === originalItem.id)
    );

    for (const removed of removedItems) {
      updates.push({ action: "delete", articleId: removed.id });
    }

    items.forEach((item) => {
      const originalItem = order.items.find((o) => o.id === item.id);
      if (!originalItem) {
        updates.push({ action: "add", articleId: item.id, quantity: item.quantity });
      } else if (originalItem.quantity !== item.quantity) {
        updates.push({ action: "update", articleId: item.id, quantity: item.quantity });
      }
    });

    const success = await updateOrderDetails(order.id, {
      status,
      note,
      updates,
    });

    if (success) {
      await fetchOrderDetails(order.id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier la commande #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <Select value={status} onValueChange={(value) => setStatus(value as OrderStatusKey)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(OrderStatus).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ajouter un article</label>
            <div className="flex gap-2">
              <Select value={selectedArticleId || ""} onValueChange={setSelectedArticleId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un produit..." />
                </SelectTrigger>
                <SelectContent>
                  {articles.map((article) => (
                    <SelectItem key={article.id} value={article.id}>
                      {article.name} - {article.price.toFixed(2)} €
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddArticle} disabled={!selectedArticleId}>
                Ajouter
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantité des articles</label>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 border p-2 rounded"
                >
                  <span className="flex-1">{item.name}</span>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSubmit}>Enregistrer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
