import { ContactForm } from '@/components/site/contact/contact-form';
import ContactInfo from '@/components/site/contact/contact-info';
import { MapComponent } from '@/components/site/map-component';

export default function ContactPage() {
	return (
		<>
			<div className="py-24">
				<div className="container-custom">
					<h1 className="heading-xl text-white text-center m-4">
						Contactez-nous
					</h1>
					<p className="text-xl text-white/90 text-center max-w-2xl mx-auto">
						Nous sommes à votre disposition pour répondre à toutes vos
						questions concernant nos produits et services.
					</p>
				</div>
			</div>
			<div className="container-custom mb-20">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<ContactInfo />
					<ContactForm />
				</div>
				<div className="mt-20">
					<h2 className="heading-md mb-6">Nous trouver</h2>
					<MapComponent />
				</div>
			</div>
		</>
	);
}
