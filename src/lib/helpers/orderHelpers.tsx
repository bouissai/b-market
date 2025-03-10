import { OrderStatus } from "@/types/order";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getStatusStep = (currentStatus: keyof typeof OrderStatus) => {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="flex items-center justify-center mt-2">
        <Badge variant="destructive">Commande annulée</Badge>
      </div>
    );
  }

  const sortedStatusesWithoutCancelled = Object.entries(OrderStatus)
    .filter(([key]) => key !== "CANCELLED")
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key]) => key as keyof typeof OrderStatus);

  const currentIndex = sortedStatusesWithoutCancelled.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      {sortedStatusesWithoutCancelled.map((status, index) => (
        <div key={status} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {index <= currentIndex ? <CheckCircle2 className="w-5 h-5" /> : <span>{index + 1}</span>}
          </div>
          <span className="text-xs mt-1 text-center">{OrderStatus[status].status}</span>
          {index < sortedStatusesWithoutCancelled.length && (
            <div className={`h-0.5 w-16 mt-4 ${index <= currentIndex ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  );
};
