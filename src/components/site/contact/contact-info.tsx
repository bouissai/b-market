import { GENERAL_INFO } from '@/constants';
import {
	Clock,
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Twitter,
} from 'lucide-react';

export default function ContactInfo() {
	return (
		<div className="p-8 shadow-salon">
			<h2 className="mb-6 flex items-center">
				<span className="w-8 h-0.5  mr-2"></span>
				Nos Coordonnées
			</h2>

			<div className="space-y-6">
				<div className="flex items-start">
					<MapPin className="h-6 w-6 shrink-0 mt-0.5 mr-3" />
					<div>
						<h3 className="font-semibold mb-1">Adresse</h3>
						<p >{GENERAL_INFO.address}</p>
					</div>
				</div>

				<div className="flex items-start">
					<Phone className="h-6 w-6  shrink-0 mt-0.5 mr-3" />
					<div>
						<h3 className="font-semibold mb-1">Téléphone</h3>
						<p >{GENERAL_INFO.phone}</p>
					</div>
				</div>

				<div className="flex items-start">
					<Mail className="h-6 w-6  shrink-0 mt-0.5 mr-3" />
					<div>
						<h3 className="font-semibold mb-1">Email</h3>
						<p >{GENERAL_INFO.email}</p>
					</div>
				</div>

				<div className="flex items-start">
					<Clock className="h-6 w-6  shrink-0 mt-0.5 mr-3" />
					<div>
						<h3 className="font-semibold mb-1">Horaires d&apos;ouverture</h3>
						<div >
							{GENERAL_INFO.openingHours.map((item, index) => (
								<div key={index}>
									<p>
										{item.days}: {item.hours.join(' / ')}
									</p>
								</div>
							))}
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
