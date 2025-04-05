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
import { Textarea } from "@/components/ui/textarea";
import { useOrderStore } from "@/store/useOrderStore";
import { useArticleStore } from "@/store/useArticleStore";
import { OrderDetailsDTO, OrderStatus, OrderStatusKey } from "@/types/order";
import { Check, ChevronsUpDown, Trash } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  order: OrderDetailsDTO;
};

export default function OrderEditForm({ order }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState(order.note || "");
  const [items, setItems] = useState(order.items || []);
  
  // Track IDs of selected articles for UI feedback
  const [selectedArticlesIds, setSelectedArticlesIds] = useState<string[]>([]);

  const { articles, fetchArticles } = useArticleStore();
  const { updateOrderDetails, fetchOrderDetails } = useOrderStore();

  // Initialize selected articles when component mounts or dialog opens
  useEffect(() => {
    if (open) {
      fetchArticles();
      // Initialize selectedArticlesIds with the IDs of items already in the order
      setSelectedArticlesIds(items.map(item => item.id));
    }
  }, [open, fetchArticles, items]);

  // Handle selecting or deselecting an article
  const handleArticleSelect = useCallback(
    (articleId: string) => {
      // Check if the article is already selected
      const isSelected = selectedArticlesIds.includes(articleId);

      if (isSelected) {
        // Deselect: remove from selectedArticlesIds and remove from items array
        setSelectedArticlesIds((prev) => prev.filter((id) => id !== articleId));
        setItems((prev) => prev.filter((item) => item.id !== articleId));
      } else {
        // Find the article details from the articles list
        const articleToAdd = articles.find((a) => a.id === articleId);
        if (articleToAdd) {
          // Add the article to selectedArticlesIds for UI indication
          setSelectedArticlesIds((prev) => [...prev, articleId]);
          // Create a new order item with a default quantity of 1
          const newItem = {
            id: articleToAdd.id,
            name: articleToAdd.name,
            quantity: 1,
            price: articleToAdd.price,
          };
          // Add the new item to the items array
          setItems((prev) => [...prev, newItem]);
        } else {
          // Error handling: Log if the article is not found
          console.error(`Article with id ${articleId} not found.`);
        }
      }
    },
    [selectedArticlesIds, articles]
  );

  const handleQuantityChange = (id: string, value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedArticlesIds((prev) => prev.filter((articleId) => articleId !== id));
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

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 px-1">
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
              <label className="block text-sm font-medium mb-1">Articles</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    Selectionner un produit...
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Chercher produit..." />
                    <CommandList>
                      <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                      <CommandGroup>
                        {articles.map((article) => (
                          <CommandItem
                            key={article.id}
                            value={article.name}
                            onSelect={() => handleArticleSelect(article.id)}
                          >
                            {/* Show checkmark if the article is selected */}
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedArticlesIds.includes(article.id)
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {article.name} - {article.price.toFixed(2)}€
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantité des articles</label>
              <ScrollArea className="max-h-72">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-6 items-center text-sm border rounded-md py-1"
                    >
                      <span className="col-span-3 pl-2">{item.name}</span>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          // Parse input ensuring a valid number (minimum 1)
                          let newValue = Number.parseInt(e.target.value);
                          if (isNaN(newValue) || newValue < 1) {
                            newValue = 1;
                          }
                          handleQuantityChange(item.id, newValue);
                        }}
                        className="col-span-2"
                      />
                      <div className="justify-self-end pr-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={handleSubmit}>Enregistrer</Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}