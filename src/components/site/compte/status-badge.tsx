// components/StatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { OrderDetailsDTO } from '@/types/order';

export const StatusBadge = ({
	status,
}: {
	status: OrderDetailsDTO['status'];
}) => {
	const statusConfig: Record<
		OrderDetailsDTO['status'],
		{
			label: string;
			variant: 'outline' | 'pending' | 'default' | 'success' | 'destructive';
		}
	> = {
		PENDING: { label: 'En attente', variant: 'outline' },
		PREPARING: { label: 'En préparation', variant: 'pending' },
		PENDING_PAYMENT: { label: 'En attente de paiement', variant: 'outline' },
		READY: { label: 'Prêt à retirer', variant: 'default' },
		COMPLETED: { label: 'Terminée', variant: 'success' },
		CANCELLED: { label: 'Annulée', variant: 'destructive' },
	};

	const config = statusConfig[status];
	return <Badge variant={config.variant}>{config.label}</Badge>;
};
