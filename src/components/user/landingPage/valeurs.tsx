"use client"

import { Card, CardContent } from "@/components/ui/card";

import { LES_VALEURS } from "@/constants";
import { animations } from "@/utils/animation";
import { motion, useInView } from "framer-motion"; // ✅ Correct
import { useRef } from "react";

export function NosValeurs() {

    const refCard = useRef(null);
    const isInViewCard = useInView(refCard, { once: true });

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref} initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center">
            <h3 className="mb-8 text-3xl font-bold"
            >
                Nos Valeurs
            </h3>
            <div ref={refCard} className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {LES_VALEURS.map((value, index) => (
                    <motion.div
                        key={value.id}
                        custom={index}
                        initial="hidden"
                        animate={isInViewCard ? "visible" : "hidden"}
                        exit="hidden"
                        variants={animations.oneByOne}
                    >
                        <Card
                            className="min-h-full bg-white shadow-lg transition-transform duration-300 hover:scale-105"
                            role="region"
                            aria-labelledby={`card-title-${value.id}`}
                        >
                            <CardContent className="p-6">
                                <h4 id={`card-title-${value.id}`} className="mb-2 text-xl font-semibold">
                                    {value.title}
                                </h4>
                                <p className="text-gray-600">{value.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}