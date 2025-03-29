import {
	MapPin,
	Phone,
	Mail,
	Clock,
	Instagram,
	Facebook,
	Twitter,
} from 'lucide-react';

export default function ContactInfo() {
	return (
		<div className="boucherie-card p-8 shadow-salon">
			<h2 className="heading-md mb-6 flex items-center">
				<span className="w-8 h-0.5 bg-boucherie-red mr-2"></span>
				Nos Coordonnées
			</h2>

			<div className="space-y-6">
				<div className="flex items-start">
					<MapPin className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
					<div>
						<h3 className="font-semibold mb-1">Adresses</h3>
						<p className="text-gray-400">
							Fontaine: 123 Rue de la Boucherie, 38600
						</p>
						<p className="text-gray-400">
							Meylan: 456 Avenue des Viandes, 38240
						</p>
					</div>
				</div>

				<div className="flex items-start">
					<Phone className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
					<div>
						<h3 className="font-semibold mb-1">Téléphone</h3>
						<p className="text-gray-400">04 76 12 34 56</p>
					</div>
				</div>

				<div className="flex items-start">
					<Mail className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
					<div>
						<h3 className="font-semibold mb-1">Email</h3>
						<p className="text-gray-400">contact@bmarket.fr</p>
					</div>
				</div>

				<div className="flex items-start">
					<Clock className="h-6 w-6 text-boucherie-red shrink-0 mt-0.5 mr-3" />
					<div>
						<h3 className="font-semibold mb-1">Horaires d'ouverture</h3>
						<div className="text-gray-400">
							<p>Lundi - Samedi: 8h00 - 19h30</p>
							<p>Dimanche: 8h00 - 13h00</p>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 pt-6 border-t border-gray-800">
				<h3 className="font-semibold mb-3">Suivez-nous</h3>
				<div className="flex space-x-4">
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="bg-gray-900 p-2 rounded-full hover:bg-boucherie-red hover:text-white transition-colors"
						aria-label="Instagram">
						<Instagram className="h-5 w-5" />
					</a>
					<a
						href="https://facebook.com"
						target="_blank"
						rel="noopener noreferrer"
						className="bg-gray-900 p-2 rounded-full hover:bg-boucherie-red hover:text-white transition-colors"
						aria-label="Facebook">
						<Facebook className="h-5 w-5" />
					</a>
					<a
						href="https://twitter.com"
						target="_blank"
						rel="noopener noreferrer"
						className="bg-gray-900 p-2 rounded-full hover:bg-boucherie-red hover:text-white transition-colors"
						aria-label="Twitter">
						<Twitter className="h-5 w-5" />
					</a>
				</div>
			</div>
		</div>
	);
}
