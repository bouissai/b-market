'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CartMergeOption, useCartStore } from '@/store/useCartStore';
import {
	CloudIcon as CloudCheck,
	Combine,
	TabletIcon as DeviceTablet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { CartItem } from '@/types/cart';

export function CartMergeDialog() {
	const { showMergePopup, handleMergeOption, localCart, remoteCart } =
		useCartStore();

	const [selectedMergeOption, setSelectedMergeOption] =
		useState<CartMergeOption | null>(null);
	const [openAccordion, setOpenAccordion] = useState<string | null>(null);
	const [mergedCart, setMergedCart] = useState<CartItem[]>([]);

	// Mettre à jour l'accordéon ouvert lorsque l'option sélectionnée change
	useEffect(() => {
		if (selectedMergeOption) {
			setOpenAccordion(`${selectedMergeOption}-items`);
		}
	}, [selectedMergeOption]);

	useEffect(() => {
		if (showMergePopup) {
			setMergedCart(mergeCarts(localCart, remoteCart));
		}
	}, [showMergePopup, localCart, remoteCart]);

	const handleContinue = () => {
		if (!selectedMergeOption) return;
		handleMergeOption(selectedMergeOption, mergedCart);
	};

	// Calcul des totaux
	const localTotal = localCart.reduce(
		(sum, item) => sum + item.article.price! * item.quantity,
		0,
	);
	const dbTotal = remoteCart.reduce(
		(sum, item) => sum + item.article.price! * item.quantity,
		0,
	);

	const mergeCarts = (localCart: CartItem[], remoteCart: CartItem[]) => {
		const mergedCart = [...localCart];

		remoteCart.forEach(remoteItem => {
			const existingItem = mergedCart.find(
				item => item.article.id === remoteItem.article.id,
			);
			if (!existingItem) {
				mergedCart.push(remoteItem);
			}
		});

		return mergedCart;
	};

	const calculateMergedTotal = (mergedCart: CartItem[]) => {
		return mergedCart.reduce(
			(sum, item) => sum + item.article.price! * item.quantity,
			0,
		);
	};
	return (
		<Dialog open={showMergePopup}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-xl">
						Conflit de panier détecté
					</DialogTitle>
					<DialogDescription>
						Nous avons trouvé un panier sauvegardé dans votre compte ainsi
						qu&apos;un panier local. Que souhaitez-vous faire?
					</DialogDescription>
				</DialogHeader>

				<div className="py-4 flex-grow overflow-auto">
					<RadioGroup
						value={selectedMergeOption || undefined}
						onValueChange={value =>
							setSelectedMergeOption(value as CartMergeOption | null)
						}>
						<div className="flex flex-col gap-4">
							{/* Un seul Accordion parent pour tous les items */}
							<Accordion
								type="single"
								className="w-full"
								value={openAccordion || undefined}
								onValueChange={setOpenAccordion}>
								{/* Option 1: Garder le panier du compte */}
								<div
									className={`border rounded-lg ${selectedMergeOption === 'db' ? 'border-red-600 bg-red-50/10' : 'border-gray-200'}`}>
									<div className="flex items-start p-4 pb-2">
										<div className="flex-shrink-0 mt-1 mr-3">
											<RadioGroupItem value={'db'} id="db" />
										</div>
										<div className="flex-grow">
											<div className="flex justify-between items-center">
												<Label
													htmlFor="db"
													className="flex items-center gap-2 font-medium text-base cursor-pointer">
													<CloudCheck className="h-5 w-5 text-red-600" />
													Garder le panier de mon compte
												</Label>
												<div className="flex items-center gap-2">
													<Badge variant="outline">
														{remoteCart.length} articles
													</Badge>
													<Badge>{dbTotal.toFixed(2)}€</Badge>
												</div>
											</div>
										</div>
									</div>

									<AccordionItem value="db-items" className="border-0">
										<AccordionTrigger className="py-2 px-4">
											Voir les articles
										</AccordionTrigger>
										<AccordionContent>
											<div className="px-4 pb-4">
												<div className="max-h-[200px] overflow-auto text-sm bg-neutral-800  rounded p-2">
													{remoteCart.map((item, i) => (
														<div
															key={i}
															className="flex justify-between py-1 border-b border-gray-100 last:border-0">
															<span>
																{item.article.name} ×{' '}
																{item.quantity}
															</span>
															<span className="font-medium">
																{(
																	item.article.price! *
																	item.quantity
																).toFixed(2)}
																€
															</span>
														</div>
													))}
												</div>
											</div>
										</AccordionContent>
									</AccordionItem>
								</div>

								{/* Option 2: Garder le panier local */}
								<div
									className={`border rounded-lg mt-4 ${selectedMergeOption === 'local' ? 'border-red-600 bg-red-50/10' : 'border-gray-200'}`}>
									<div className="flex items-start p-4 pb-2">
										<div className="flex-shrink-0 mt-1 mr-3">
											<RadioGroupItem value="local" id="local" />
										</div>
										<div className="flex-grow">
											<div className="flex justify-between items-center">
												<Label
													htmlFor="local"
													className="flex items-center gap-2 font-medium text-base cursor-pointer">
													<DeviceTablet className="h-5 w-5 text-red-600" />
													Garder le panier de cet appareil
												</Label>
												<div className="flex items-center gap-2">
													<Badge variant="outline">
														{localCart.length} articles
													</Badge>
													<Badge>{localTotal.toFixed(2)}€</Badge>
												</div>
											</div>
										</div>
									</div>

									<AccordionItem
										value="local-items"
										className="border-0">
										<AccordionTrigger className="py-2 px-4">
											Voir les articles
										</AccordionTrigger>
										<AccordionContent>
											<div className="px-4 pb-4">
												<div className="max-h-[200px] overflow-auto bg-neutral-800 text-sm rounded p-2">
													{localCart.map((item, i) => (
														<div
															key={i}
															className="flex justify-between py-1 border-b border-gray-100 last:border-0">
															<span>
																{item.article.name} ×{' '}
																{item.quantity}
															</span>
															<span className="font-medium">
																{(
																	item.article.price! *
																	item.quantity
																).toFixed(2)}
																€
															</span>
														</div>
													))}
												</div>
											</div>
										</AccordionContent>
									</AccordionItem>
								</div>

								{/* Option 3: Fusionner les paniers */}
								<div
									className={`border rounded-lg mt-4 ${selectedMergeOption === 'merge' ? 'border-red-600 bg-red-50/10' : 'border-gray-200'}`}>
									<div className="flex items-start p-4 pb-2">
										<div className="flex-shrink-0 mt-1 mr-3">
											<RadioGroupItem value="merge" id="merge" />
										</div>
										<div className="flex-grow">
											<div className="flex justify-between items-center">
												<Label
													htmlFor="merge"
													className="flex items-center gap-2 font-medium text-base cursor-pointer">
													<Combine className="h-5 w-5 text-red-600" />
													Fusionner les deux paniers
												</Label>
												<div className="flex items-center gap-2">
													<Badge variant="outline">
														{mergedCart.length} articles
													</Badge>
													<Badge>
														{calculateMergedTotal(
															mergedCart,
														).toFixed(2)}
														€
													</Badge>
												</div>
											</div>
										</div>
									</div>

									<AccordionItem
										value="merge-items"
										className="border-0">
										<AccordionTrigger className="py-2 px-4">
											Voir les articles
										</AccordionTrigger>
										<AccordionContent>
											<div className="px-4 pb-4">
												<Tabs defaultValue="all" className="w-full">
													<TabsList className="grid w-full grid-cols-3">
														<TabsTrigger value="all">
															Tous ({mergedCart.length})
														</TabsTrigger>
														<TabsTrigger value="local">
															Appareil ({localCart.length})
														</TabsTrigger>
														<TabsTrigger value="db">
															Compte ({remoteCart.length})
														</TabsTrigger>
													</TabsList>
													<TabsContent
														value="all"
														className="max-h-[200px] overflow-auto text-sm bg-neutral-800 rounded p-2">
														{mergedCart.map(item => (
															<div
																key={item.article.id}
																className="flex justify-between py-1 border-b border-gray-100 last:border-0">
																<span>
																	{item.article.name} ×{' '}
																	{item.quantity}
																</span>
																<span className="font-medium">
																	{(
																		item.article.price! *
																		item.quantity
																	).toFixed(2)}
																	€
																</span>
															</div>
														))}
													</TabsContent>
													<TabsContent
														value="local"
														className="max-h-[200px] overflow-auto text-sm bg-neutral-800 rounded p-2">
														{localCart.map((item, i) => (
															<div
																key={i}
																className="flex justify-between py-1 border-b border-gray-100 last:border-0">
																<span>
																	{item.article.name} ×{' '}
																	{item.quantity}
																</span>
																<span className="font-medium">
																	{(
																		item.article.price! *
																		item.quantity
																	).toFixed(2)}
																	€
																</span>
															</div>
														))}
													</TabsContent>
													<TabsContent
														value="db"
														className="max-h-[200px] overflow-auto text-sm bg-neutral-800 rounded p-2">
														{remoteCart.map((item, i) => (
															<div
																key={i}
																className="flex justify-between py-1 border-b border-gray-100 last:border-0">
																<span>
																	{item.article.name} ×{' '}
																	{item.quantity}
																</span>
																<span className="font-medium">
																	{(
																		item.article.price! *
																		item.quantity
																	).toFixed(2)}
																	€
																</span>
															</div>
														))}
													</TabsContent>
												</Tabs>
											</div>
										</AccordionContent>
									</AccordionItem>
								</div>
							</Accordion>
						</div>
					</RadioGroup>
				</div>

				<DialogFooter>
					<Button
						onClick={handleContinue}
						disabled={!selectedMergeOption}
						className="w-full sm:w-auto bg-red-700 hover:bg-red-800">
						Continuer
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
