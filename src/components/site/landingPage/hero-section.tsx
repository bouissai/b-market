'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
export function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
			<div className="absolute inset-0 z-0">
				<Image
					src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1920&h=1080&fit=crop&crop=focalpoint&auto=format&q=80"
					alt="Viande de qualité"
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-boucherie-black/95 via-boucherie-black/80 to-boucherie-black/60"></div>
			</div>
			<div className="container-custom relative z-10">
				<div className="max-w-2xl text-white">
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight font-playfair">
						Boucherie{' '}
						<span className="text-transparent bg-clip-text bg-red-gradient animate-shimmer bg-[length:200%_auto]">
							B Market
						</span>
					</h1>

					<p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed font-montserrat">
						Depuis 1982, nous vous proposons des viandes halal de qualité,
						fraîches et découpées sur place par nos bouchers expérimentés.
					</p>

					<div className="flex flex-wrap gap-4">
						<Button
							asChild
							size="lg"
							className="relative overflow-hidden text-lg px-8 py-6 bg-boucherie-red text-white hover:bg-boucherie-red-light rounded-md
                       shadow-[0_0_15px_rgba(139,0,0,0.5)] group transition-all duration-300
                       animate-slow-pulse hover:animate-none">
							<Link
								href="/produits"
								className="relative flex items-center justify-center">
								<span
									className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent
                              w-full h-full animate-shine pointer-events-none"
								/>

								<span className="relative z-10 flex items-center">
									Commander en ligne
									<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
								</span>
							</Link>
						</Button>
					</div>
				</div>
			</div>

			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-boucherie-black to-transparent"></div>
		</section>
	);
}
