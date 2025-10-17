import { AnimatedSection } from '../animations/animated-section';
import EventCard from './event-card';

type EventType = {
	id: string;
	title: string;
	description: string;
	image: string;
	features: string[];
};

type ServiceEventsProps = {
	eventTypes: EventType[];
};

export function ServiceEvents(events: ServiceEventsProps) {
	return (
		<AnimatedSection>
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">
						Nos services pour événements
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Nous proposons une gamme complète de services pour répondre à
						tous vos besoins en viande pour vos événements spéciaux.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{events.eventTypes.map(event => (
						<EventCard key={event.id} event={event} />
					))}
				</div>
			</div>
		</AnimatedSection>
	);
}
