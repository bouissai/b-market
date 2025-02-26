'use client'

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ContactLandingPage() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    return (
        <section id="contact" ref={ref}>
            <div>
                <h1 className="text-2xl font-bold mb-6">Contact</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >

                        <img
                            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                            alt="Photo by Drew Beamer"
                            className="h-full w-full rounded-md object-cover"
                        />
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                                alt="Photo by Drew Beamer"
                                className="h-full w-full rounded-md object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}