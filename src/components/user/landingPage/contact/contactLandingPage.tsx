'use client';

import { MapComponent } from '@/components/user/landingPage/contact/mapComponent';
import { animations } from '@/lib/helpers/animation';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';

export function ContactLandingPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="min-h-screen from-background to-muted py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={animations.fadeInDown}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className=" mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            variants={animations.withDelay(animations.fadeInDown, 0.2)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-3xl font-bold mb-6"
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            variants={animations.withDelay(animations.fadeIn, 0.4)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mt-4 text-lg text-muted-foreground"
          >
            Nous sommes là pour répondre à toutes vos questions
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <ContactForm></ContactForm>

          {/* Informations de contact */}
          <ContactInfo></ContactInfo>
        </div>

        {/* Carte animée */}
        <MapComponent />
      </motion.div>
    </div>
  );
}
