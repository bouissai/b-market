import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

type CartClearConfirmDialogProps = {
	// Props for the dialog
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
};

export function CartClearConfirmDialog({
	isOpen,
	onConfirm,
	onClose,
}: CartClearConfirmDialogProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Vider le panier ?</DialogTitle>
					<DialogDescription>
						Cette action supprimera tous les articles de votre panier.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onClose()}>
						Annuler
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							onConfirm();
						}}>
						Vider
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
