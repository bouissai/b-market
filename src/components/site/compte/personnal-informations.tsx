'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';

export default function PersonnalInformations() {
	const { data: session } = useSession();

	const [name, setName] = useState(session?.user?.name || '');
	const [email, setEmail] = useState(session?.user?.email || '');
	const [phone, setPhone] = useState('');
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (password && password !== confirmPassword) {
			alert('Les mots de passe ne correspondent pas');
			return;
		}

		// Exemple de traitement (à remplacer par un appel API ou autre)
		console.log({
			name,
			email,
			phone,
			profileImage,
			password,
		});

		alert('Informations enregistrées (à implémenter)');
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setProfileImage(file);
		}
	};

	return (
		<Card>
			<CardContent className="p-6">
				<h1 className="text-2xl font-bold mb-4">
					Mes informations personnelles
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="name">Nom</Label>
						<Input
							id="name"
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>

					<div>
						<Label htmlFor="email">Adresse e-mail</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<Label htmlFor="phone">Numéro de téléphone</Label>
						<PhoneInput
							id="phone"
							value={phone}
							onChange={setPhone}
							className="w-full"
							placeholder="01 23 45 67 89"
							international={false}
							defaultCountry="FR"
						/>
					</div>

					<div>
						<Label htmlFor="profileImage">Image de profil</Label>
						<Input
							id="profileImage"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
						/>
					</div>

					<div>
						<Label htmlFor="password">Nouveau mot de passe</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>

					<div>
						<Label htmlFor="confirmPassword">
							Confirmer le mot de passe
						</Label>
						<Input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
						/>
					</div>

					<Button type="submit">Enregistrer les modifications</Button>
				</form>
			</CardContent>
		</Card>
	);
}
