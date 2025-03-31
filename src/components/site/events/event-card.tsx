import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

type EventCardProps = {
	event: {
		id: string;
		title: string;
		description: string;
		image: string;
		features: string[];
	};
};

export default function EventCard({ event }: EventCardProps) {
	return (
		<Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
			<div className="relative h-48 w-full overflow-hidden">
				<Image
					src={event.image || '/placeholder.svg'}
					alt={event.title}
					fill
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 p-4">
					<h3 className="text-xl font-semibold text-white">
						{event.title}
					</h3>
				</div>
			</div>
			<CardContent className="p-6">
				<p className="text-muted-foreground mb-4">{event.description}</p>
				<ul className="space-y-2">
					{event.features.map((feature, index) => (
						<li key={index} className="flex items-start">
							<CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
