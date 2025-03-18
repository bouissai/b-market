'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ_DATA } from "@/constants";
import { animations } from "@/lib/helpers/animation";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function Faq() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    return (
        <div ref={ref}
            className="min-h-10 text-center w-full mx-auto py-12 px-4" id="faq">
            <div>
                <motion.h1
                    variants={animations.withDelay(animations.fadeInDown, 0.2)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="text-3xl font-bold mb-6"
                >
                    Foire aux questions
                </motion.h1>
                <div className="relative z-10 flex justify-between items-center px-12 ">
                    <Accordion className="min-w-full w-full" type="single" collapsible>
                        {FAQ_DATA.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-2xl">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-lg text-left">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )


}