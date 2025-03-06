'use client'

import { animations } from "@/utils/animation";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function MapComponent() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            variants={animations.withCustomTransition(animations.scale, 1, 0.1)} // Durée: 1s, Délai: 0.1s
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-12 h-[500px] rounded-lg overflow-hidden shadow-lg"
        >
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.426687851703!2d5.692972611875998!3d45.19230525141823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478a8ca75edc948d%3A0xe04d3a9d1eb372ec!2sB%20MARKET%20par%20Hassan%20BOUISSA!5e1!3m2!1sfr!2sfr!4v1740751238874!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Emplacement de la boucherie à Fontaine"
                className="rounded-lg"
            />
        </motion.div>
    )
}
