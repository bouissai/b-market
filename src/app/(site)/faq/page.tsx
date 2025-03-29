import { FaqSection } from '@/components/site/landingPage/faq/faq-section';
import { FAQ_DATA } from '@/constants';

export default function FaqPage() {
	return (
		<div className="container mx-auto px-4" id="faq">
			<div>
				<div className="relative z-10 flex justify-between items-center px-12 ">
					<FaqSection
						title="Foire aux questions"
						subtitle="Tout ce que vous devez savoir sur nos services pour événements"
						data={FAQ_DATA}
					/>
					;
				</div>
			</div>
		</div>
	);
}
