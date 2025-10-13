import { ContactForm } from '@/components/site/contact/contact-form';
import ContactInfo from '@/components/site/contact/contact-info';
import { MapComponent } from '@/components/site/map-component';

export default function ContactPage() {
	return (
		<>
			<header>
				<div className="container mx-auto px-6 py-12 md:py-10">
					<h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-light text-foreground text-center tracking-tight leading-tight">
						Contactez-nous
					</h1>
					<p className="text-muted-foreground text-center mt-4 md:mt-6 text-base md:text-lg max-w-2xl mx-auto font-light tracking-wide">
						Nous sommes à votre disposition pour répondre à toutes vos
						questions concernant nos produits et services.
					</p>
				</div>
			</header>
			<div className="mb-20">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-8">
					<ContactInfo />
					<ContactForm />
				</div>
				<div className='p-8'>
					<div className="relative h-[300px] lg:h-[400px] bg-muted/30 rounded-lg overflow-hidden border border-border/30 shadow-2xl">
						<MapComponent></MapComponent>
					</div>
				</div>
			</div>
		</>
	);
}
