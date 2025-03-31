'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function MapComponent() {
	const [mapLoaded, setMapLoaded] = useState(false);

	return (
		<motion.div className="bg-gray-900 h-[400px] w-full flex items-center justify-center text-gray-500 text-lg rounded-lg">
			{!mapLoaded ? (
				<div className="text-center p-6">
					<p className="text-lg text-gray-700 mb-4">
						Pour voir la carte, acceptez l'affichage de Google Maps.
					</p>
					<button
						onClick={() => setMapLoaded(true)}
						className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition">
						Charger la carte
					</button>
				</div>
			) : (
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.426687851703!2d5.692972611875998!3d45.19230525141823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478a8ca75edc948d%3A0xe04d3a9d1eb372ec!2sB%20MARKET%20par%20Hassan%20BOUISSA!5e1!3m2!1sfr!2sfr!4v1740751238874!5m2!1sfr!2sfr"
					width="100%"
					height="100%"
					style={{ border: 0 }}
					allowFullScreen={false}
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					title="Emplacement de la boucherie Ã Fontaine"
					className="rounded-lg"
				/>
			)}
		</motion.div>
	);
}
