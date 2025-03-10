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
        <div ref={ref} className="p-10 box-border">
            <motion.div
                variants={animations.withDelay(animations.scale, 0.2)}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <h2 className="text-3xl text-center font-bold mb-6">Nos Valeurs</h2>
                <div ref={refCard} className="grid grid-cols-1 gap-28 md:grid-cols-3">
                    {LES_VALEURS.map((value, index) => (
                        <motion.div
                            key={value.id}
                            custom={index}
                            variants={animations.oneByOne}
                        >
                            <Card
                                className="min-h-full bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:text-red-600  "
                                role="region"
                                aria-labelledby={`card-title-${value.id}`}
                            >
                                <CardContent className="py-4 box-border flex flex-col items-center justify-center">
                                    <p className="text-5xl">{<value.icon strokeWidth="1.6" size="44" />}</p>
                                    <h3 id={`card-title-${value.id}`} className="text-center pb-2 text-3xl font-semibold">
                                        {value.title}
                                    </h3>
                                    <p className="text-center  text-gray-600 max-w-sm">{value.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}