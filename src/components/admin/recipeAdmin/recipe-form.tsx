'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { type FieldPath, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowDown, ArrowUp, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { extractPublicId } from '@/lib/helpers/extractPublicId';
import { recipePostSchema } from '@/lib/validations/recipe';
import { useImageStore } from '@/store/useImageStore';
import { useRecipeStore } from '@/store/useRecipeStore';
import type { ArticleGetDto } from '@/types/article';
import type {
	RecipeDetailDto,
	RecipeFormValues,
	RecipePutDto,
} from '@/types/recipe';
import { RecipeImage } from './recipe-image';

type RecipeFormProps = {
	recipe: RecipeDetailDto | null;
	articles: ArticleGetDto[];
};

const NONE_VALUE = '__none__';

function toFormValues(recipe: RecipeDetailDto | null): RecipeFormValues {
	return {
		title: recipe?.title ?? '',
		description: recipe?.description ?? '',
		image: recipe?.image ?? '/images/no-img.png',
		category: recipe?.category ?? 'plat-principal',
		prepTime: recipe?.prepTime ?? 0,
		cookTime: recipe?.cookTime ?? 0,
		servings: recipe?.servings ?? 4,
		difficulty: recipe?.difficulty ?? 'facile',
		tags: recipe?.tags ?? [],
		featured: recipe?.featured ?? false,
		forEvents: recipe?.forEvents ?? false,
		calories: recipe?.nutrition?.calories ?? null,
		protein: recipe?.nutrition?.protein ?? null,
		carbs: recipe?.nutrition?.carbs ?? null,
		fat: recipe?.nutrition?.fat ?? null,
		ingredients:
			recipe?.ingredients.map(ingredient => ({
				id: ingredient.id,
				name: ingredient.name,
				displayQuantity: ingredient.displayQuantity,
				position: ingredient.position,
				articleId: ingredient.articleId,
				cartQuantity: ingredient.cartQuantity,
			})) ?? [
				{
					name: '',
					displayQuantity: '',
					position: 1,
					articleId: null,
					cartQuantity: null,
				},
			],
		steps:
			recipe?.steps.map(step => ({
				id: step.id,
				description: step.description,
				position: step.position,
			})) ?? [{ description: '', position: 1 }],
	};
}

function parseTags(value: string) {
	return value
		.split(',')
		.map(tag => tag.trim())
		.filter(Boolean);
}

export function RecipeForm({ recipe, articles }: RecipeFormProps) {
	const { addRecipe, updateRecipe, setSelectedRecipe, isSubmitting } =
		useRecipeStore();
	const { deleteImage, defaultImageUrl } = useImageStore();
	const [imageUrl, setImageUrl] = useState(recipe?.image || defaultImageUrl);
	const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
	const isEdit = Boolean(recipe);

	const form = useForm<RecipeFormValues>({
		resolver: zodResolver(recipePostSchema),
		defaultValues: toFormValues(recipe),
	});

	const {
		fields: ingredientFields,
		append: appendIngredient,
		remove: removeIngredient,
		move: moveIngredient,
	} = useFieldArray({
		control: form.control,
		name: 'ingredients',
	});
	const {
		fields: stepFields,
		append: appendStep,
		remove: removeStep,
		move: moveStep,
	} = useFieldArray({
		control: form.control,
		name: 'steps',
	});
	const pendingFocusRef = useRef<string | null>(null);

	useEffect(() => {
		form.reset(toFormValues(recipe));
		setImageUrl(recipe?.image || defaultImageUrl);
		setUploadedImageUrls([]);
	}, [defaultImageUrl, form, recipe]);

	useEffect(() => {
		if (!pendingFocusRef.current) return;

		const fieldName = pendingFocusRef.current;
		pendingFocusRef.current = null;

		requestAnimationFrame(() => {
			form.setFocus(fieldName as FieldPath<RecipeFormValues>);
		});
	}, [form, ingredientFields.length, stepFields.length]);

	const categories = useMemo(
		() => [
			...new Set([
				'plat-principal',
				'entrée',
				'accompagnement',
				...articles.map(article => article.categoryName),
			]),
		],
		[articles],
	);

	const cleanupUploadedImages = async (keptImage: string, originalImage?: string) => {
		const urlsToDelete = uploadedImageUrls.filter(
			url => url !== keptImage && url !== originalImage && url !== defaultImageUrl,
		);

		for (const url of urlsToDelete) {
			const publicId = extractPublicId(url, defaultImageUrl);
			if (publicId) await deleteImage(publicId);
		}
	};

	const hasUnsavedChanges = () =>
		form.formState.isDirty || imageUrl !== (recipe?.image || defaultImageUrl);

	const handleCancel = async () => {
		if (
			hasUnsavedChanges() &&
			!window.confirm(
				'Des modifications non enregistrées seront perdues. Fermer le formulaire ?',
			)
		) {
			return;
		}

		await cleanupUploadedImages(recipe?.image || '', recipe?.image);
		if (
			imageUrl !== recipe?.image &&
			imageUrl !== defaultImageUrl &&
			!uploadedImageUrls.includes(imageUrl)
		) {
			const publicId = extractPublicId(imageUrl, defaultImageUrl);
			if (publicId) await deleteImage(publicId);
		}
		setSelectedRecipe(null, null);
	};

	const addIngredientAtEnd = () => {
		const nextIndex = ingredientFields.length;
		appendIngredient({
			name: '',
			displayQuantity: '',
			position: nextIndex + 1,
			articleId: null,
			cartQuantity: null,
		});
		pendingFocusRef.current = `ingredients.${nextIndex}.name`;
	};

	const addStepAtEnd = () => {
		const nextIndex = stepFields.length;
		appendStep({
			description: '',
			position: nextIndex + 1,
		});
		pendingFocusRef.current = `steps.${nextIndex}.description`;
	};

	const handleSubmit = async (values: RecipeFormValues) => {
		const payload: RecipeFormValues = {
			...values,
			image: imageUrl || defaultImageUrl,
			tags: values.tags.map(tag => tag.trim()).filter(Boolean),
			ingredients: values.ingredients.map((ingredient, index) => ({
				...ingredient,
				position: index + 1,
				articleId: ingredient.articleId || null,
				cartQuantity: ingredient.articleId
					? (ingredient.cartQuantity ?? 1)
					: null,
			})),
			steps: values.steps.map((step, index) => ({
				...step,
				position: index + 1,
			})),
		};

		const saved = recipe
			? await updateRecipe({ ...payload, id: recipe.id } satisfies RecipePutDto)
			: await addRecipe(payload);

		if (!saved) return;

		await cleanupUploadedImages(saved.image, recipe?.image);
		setSelectedRecipe(null, null);
	};

	return (
		<Dialog open onOpenChange={open => !open && void handleCancel()}>
			<DialogContent className="flex max-h-[92vh] flex-col gap-0 p-0 sm:max-w-4xl">
				<DialogHeader className="border-b px-6 py-4">
					<DialogTitle>
						{isEdit ? 'Modifier la recette' : 'Ajouter une recette'}
					</DialogTitle>
					<DialogDescription>
						Renseignez la recette, ses ingrédients, ses étapes et les produits du
						catalogue à ajouter au panier.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex min-h-0 flex-1 flex-col">
						<div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
						<div className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Titre</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Catégorie</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Choisir une catégorie" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map(category => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea rows={3} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<RecipeImage
							imageUrl={imageUrl}
							setImageUrl={setImageUrl}
							onUploadSuccess={url => setUploadedImageUrls(prev => [...prev, url])}
						/>

						<div className="grid gap-4 md:grid-cols-4">
							<FormField
								control={form.control}
								name="prepTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Préparation (min)</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												{...field}
												onChange={event => field.onChange(Number(event.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="cookTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cuisson (min)</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												{...field}
												onChange={event => field.onChange(Number(event.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="servings"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Portions</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={1}
												{...field}
												onChange={event => field.onChange(Number(event.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="difficulty"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Difficulté</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="facile">Facile</SelectItem>
												<SelectItem value="moyen">Moyen</SelectItem>
												<SelectItem value="difficile">Difficile</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<Input
											value={field.value.join(', ')}
											onChange={event => field.onChange(parseTags(event.target.value))}
											placeholder="boeuf, oriental, rapide"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid gap-4 md:grid-cols-4">
							{(['calories', 'protein', 'carbs', 'fat'] as const).map(name => (
								<FormField
									key={name}
									control={form.control}
									name={name}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{{
													calories: 'Calories',
													protein: 'Protéines',
													carbs: 'Glucides',
													fat: 'Lipides',
												}[name]}
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={1}
													value={field.value ?? ''}
													onChange={event =>
														field.onChange(
															event.target.value
																? Number(event.target.value)
																: null,
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
						</div>

						<div className="flex flex-wrap gap-6">
							<FormField
								control={form.control}
								name="featured"
								render={({ field }) => (
									<FormItem className="flex items-center gap-2 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={checked => field.onChange(checked === true)}
											/>
										</FormControl>
										<FormLabel>Mise en avant</FormLabel>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="forEvents"
								render={({ field }) => (
									<FormItem className="flex items-center gap-2 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={checked => field.onChange(checked === true)}
											/>
										</FormControl>
										<FormLabel>Recette événement</FormLabel>
									</FormItem>
								)}
							/>
						</div>

						<section className="space-y-3">
							<div className="flex items-center justify-between gap-4">
								<div>
									<h3 className="font-medium">Ingrédients</h3>
									<p className="text-sm text-muted-foreground">
										Ajoutez les produits liés seulement quand ils doivent pouvoir
										être envoyés au panier.
									</p>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addIngredientAtEnd}>
									<Plus className="mr-2 h-4 w-4" aria-hidden="true" />
									Ajouter un ingrédient
								</Button>
							</div>
							{ingredientFields.map((field, index) => {
								const articleId = form.watch(`ingredients.${index}.articleId`);
								return (
									<div
										key={field.id}
										className="grid gap-3 rounded-md border p-3 md:grid-cols-[auto_1fr_140px_1fr_120px_auto]">
										<div className="flex items-start gap-1 pt-7">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => moveIngredient(index, index - 1)}
												disabled={index === 0}
												aria-label="Déplacer cet ingrédient vers le haut">
												<ArrowUp className="h-4 w-4" aria-hidden="true" />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => moveIngredient(index, index + 1)}
												disabled={index === ingredientFields.length - 1}
												aria-label="Déplacer cet ingrédient vers le bas">
												<ArrowDown className="h-4 w-4" aria-hidden="true" />
											</Button>
										</div>
										<FormField
											control={form.control}
											name={`ingredients.${index}.name`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nom</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`ingredients.${index}.displayQuantity`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Quantité</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`ingredients.${index}.articleId`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Article lié</FormLabel>
													<Select
														value={field.value ?? NONE_VALUE}
														onValueChange={value => {
															const nextValue = value === NONE_VALUE ? null : value;
															field.onChange(nextValue);
															form.setValue(
																`ingredients.${index}.cartQuantity`,
																nextValue ? 1 : null,
															);
														}}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value={NONE_VALUE}>Aucun</SelectItem>
															{articles.map(article => (
																<SelectItem key={article.id} value={article.id}>
																	{article.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`ingredients.${index}.cartQuantity`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Qté panier</FormLabel>
													<FormControl>
														<Input
															type="number"
															min={1}
															disabled={!articleId}
															value={field.value ?? ''}
															onChange={event =>
																field.onChange(
																	event.target.value
																		? Number(event.target.value)
																		: null,
																)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="self-end"
											onClick={() => removeIngredient(index)}
											disabled={ingredientFields.length === 1}
											aria-label="Supprimer cet ingrédient">
											<Trash className="h-4 w-4" aria-hidden="true" />
										</Button>
									</div>
								);
							})}
							<Button
								type="button"
								variant="outline"
								className="w-full justify-center"
								onClick={addIngredientAtEnd}>
								<Plus className="mr-2 h-4 w-4" aria-hidden="true" />
								Ajouter un ingrédient
							</Button>
						</section>

						<section className="space-y-3">
							<div className="flex items-center justify-between gap-4">
								<div>
									<h3 className="font-medium">Étapes</h3>
									<p className="text-sm text-muted-foreground">
										L’ordre ci-dessous sera conservé sur la page publique.
									</p>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addStepAtEnd}>
									<Plus className="mr-2 h-4 w-4" aria-hidden="true" />
									Ajouter une étape
								</Button>
							</div>
							{stepFields.map((field, index) => (
								<div
									key={field.id}
									className="grid gap-3 rounded-md border p-3 md:grid-cols-[auto_1fr_auto]">
									<div className="flex items-start gap-1 pt-7">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => moveStep(index, index - 1)}
											disabled={index === 0}
											aria-label="Déplacer cette étape vers le haut">
											<ArrowUp className="h-4 w-4" aria-hidden="true" />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => moveStep(index, index + 1)}
											disabled={index === stepFields.length - 1}
											aria-label="Déplacer cette étape vers le bas">
											<ArrowDown className="h-4 w-4" aria-hidden="true" />
										</Button>
									</div>
									<FormField
										control={form.control}
										name={`steps.${index}.description`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Étape {index + 1}</FormLabel>
												<FormControl>
													<Textarea rows={2} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="self-end"
										onClick={() => removeStep(index)}
										disabled={stepFields.length === 1}
										aria-label="Supprimer cette étape">
										<Trash className="h-4 w-4" aria-hidden="true" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								className="w-full justify-center"
								onClick={addStepAtEnd}>
								<Plus className="mr-2 h-4 w-4" aria-hidden="true" />
								Ajouter une étape
							</Button>
						</section>

						</div>

						<DialogFooter className="border-t bg-background px-6 py-4">
							<Button type="button" variant="outline" onClick={handleCancel}>
								Annuler
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting
									? 'Enregistrement...'
									: isEdit
										? 'Modifier'
										: 'Ajouter'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
