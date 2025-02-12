"use client"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface OrderItem {
  productId: string
  quantity: number
}

interface OrderFormProps {
  onSubmit: () => void
  onCancel: () => void
}

export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const [userId, setUserId] = useState("")
  const [status, setStatus] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ productId: "", quantity: 1 }])
  const [error, setError] = useState<string | null>(null)

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: 1 }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index)
    setOrderItems(newItems)
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setOrderItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await onSubmit({ userId, status, orderItems })
      // Reset form
      setUserId("")
      setStatus("")
      setOrderItems([{ productId: "", quantity: 1 }])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userId">User ID</Label>
        <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Input id="status" value={status} onChange={(e) => setStatus(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>Order Items</Label>
        {orderItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder="Product ID"
              value={item.productId}
              onChange={(e) => handleItemChange(index, "productId", e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
              required
              min="1"
            />
            <Button type="button" variant="destructive" onClick={() => handleRemoveItem(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={handleAddItem}>
          Add Item
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Order</Button>
      </DialogFooter>
    </form>
  )
}

