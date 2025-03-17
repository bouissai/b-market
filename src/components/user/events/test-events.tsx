import Image from 'next/image';


type TestimonialsType = {
    id: string;
    name: string;
    date: string;
    quote: string;
    image: string;
};

type TestimonialsEventsProps = {
    testimonialsType: TestimonialsType[];
};


export function TestimonialsEvents(testimonials: TestimonialsEventsProps) {

    return (
        <>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Ce que disent nos clients
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Découvrez les témoignages de clients satisfaits qui nous ont fait
                        confiance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.testimonialsType.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-background p-6 rounded-lg shadow-sm border"
                        >
                            <div className="flex items-center mb-4">
                                <div className="relative w-12 h-12 overflow-hidden mr-4">
                                    <Image
                                        src={testimonial.image || '/placeholder.svg'}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Il y a {testimonial.date}
                                    </p>
                                </div>
                            </div>
                            <p className="italic text-muted-foreground">
                                "{testimonial.quote}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}