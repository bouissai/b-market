'use client';

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type FaqItem = {
    question: string;
    answer: string;
};

type FaqSectionProps = {
    title: string;
    subtitle: string;
    data: FaqItem[];
};

export function FaqSection({ title,subtitle, data }: FaqSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
        
    return (
        <div ref={ref} className="container mx-auto px-4" id="faq">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">
                    {title}
                </h2>
                    
                <p className="mt-4 text-lg text-muted-foreground">
                    {subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-4xl">
                {data.map((item: FaqItem, index: number) => (
                    <motion.div 
                        key={index} 
                        className="bg-background p-6 rounded-lg shadow-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                        <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                        <p className="text-muted-foreground">{item.answer}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
