'use client'
import { motion, useInView } from "framer-motion"; // Correction de l'import de motion
import { MoveDown, ShoppingBag } from "lucide-react";
import Image from 'next/image';
import { useRef } from "react";

export function ButcheryActivity() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section ref={ref}
        className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto overflow-hidden"
        aria-labelledby="butchery-title">
            <div>
                {/* Motion container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.2 }}
                        className="space-y-6 text-center"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl md:text-6xl font-bold text-gray-900"
                        >
                            Votre Artisan Boucher
                            <span className="block text-red-700 mt-2">Depuis 1989</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-gray-600"
                        >
                            Découvrez Des Viandes De Qualité À Fontaine
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="#click-collect"
                                className="inline-flex items-center px-8 py-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-300"
                            >
                                <ShoppingBag className="h-5 w-5 mr-2" />
                                <span>Click & collect</span>
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=75"
                                alt="Boucher professionnel"
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                                className="object-cover"
                                priority={true}
                                quality={75}
                                fetchPriority="high"
                                loading="eager"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-8 relative flex flex-col items-center"
                >
                    {/* Texte animé + icône MoveDown */}
                    <motion.div
                        animate={isInView ? { y: [0, 5, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-center flex flex-col items-center"
                    >
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-700">Découvrir</p>
          <MoveDown className="w-6 h-6 mt-2 text-red-700" aria-hidden="true" />
                        </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
