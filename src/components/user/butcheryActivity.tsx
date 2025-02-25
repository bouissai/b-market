'use client'
import { motion, useInView } from "framer-motion"; // Correction de l'import de motion
import { MoveDown, ShoppingBag } from "lucide-react";
import { useRef } from "react";

export function ButcheryActivity() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (


        <div>
            {/* Motion container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
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
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1200&q=80"
                            alt="Boucher professionnel"
                            className="w-full h-[600px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>

                </motion.div>
            </div>

            <motion.div ref={ref}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 1 }}
                className="mt-8 relative flex flex-col items-center"
            >
                {/* Texte animé + icône MoveDown */}
                <motion.div
                    animate={{ y: [5, 20, 5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-center flex flex-col items-center"
                >
                    <p className="text-sm uppercase tracking-wider">Découvrir</p>
                    <MoveDown className="w-6 h-6 mt-2" />
                </motion.div>
            </motion.div>
        </div>
    );
}
