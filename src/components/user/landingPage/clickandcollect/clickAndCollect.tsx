'use client';

import { animations } from '@/lib/helpers/animation';
import { motion, useInView } from 'framer-motion';
import { ChefHat, ClipboardCheck, Clock, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ClickCollectSteps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      icon: <ShoppingBag size={28} />,
      title: 'Commandez en ligne',
      description: 'Sélectionnez vos produits et personnalisez votre commande.',
    },
    {
      icon: <ClipboardCheck size={28} />,
      title: 'Validation',
      description:
        'Notre équipe vérifie votre commande et confirme sa disponibilité.',
    },
    {
      icon: <ChefHat size={28} />,
      title: 'Préparation',
      description: 'Notre artisan boucher prépare votre commande avec soin.',
    },
    {
      icon: <Clock size={28} />,
      title: 'Retrait en magasin',
      description: "Venez chercher votre commande à l'heure choisie.",
    },
  ];

  // Automatic animation through steps
  useEffect(() => {
    if (!isInView) return;

    let timeout: NodeJS.Timeout;

    const advanceStep = (currentStep: number) => {
      if (currentStep < steps.length) {
        setActiveStep(currentStep);
        setCompletedSteps((prev) => [...prev, currentStep - 1].filter((n) => n >= 0));

        timeout = setTimeout(() => {
          advanceStep(currentStep + 1);
        }, 2000);
      } else {
        // Reset after completing all steps (optional)
        setTimeout(() => {
          setActiveStep(0);
          setCompletedSteps([]);
          advanceStep(0);
        }, 3000);
      }
    };

    // Start the animation sequence
    advanceStep(0);

    return () => {
      clearTimeout(timeout);
    };
  }, [isInView, steps.length]);

  return (
    <div ref={ref} className="min-h-10 text-center w-full mx-auto py-12 px-4">
      <motion.h2
        variants={animations.withDelay(animations.fadeInDown, 0.2)}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-3xl font-bold mb-6"
      >
        Click & Collect
      </motion.h2>

      <motion.p
        variants={animations.withDelay(animations.fadeIn, 0.4)}
        initial="hidden"
        animate="visible"
        className="mt-4 text-lg text-muted-foreground"
      >
        Commandez en ligne et récupérez vos achats directement en magasin.
      </motion.p>

      <div className="relative mt-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col items-center max-w-[250px] transition-all duration-300 ${activeStep === index ? 'scale-105' : 'opacity-70'
                }`}
              animate={activeStep === index ? { y: -10 } : { y: 0 }}
            >
              <motion.div
                className={`relative flex items-center justify-center w-16 h-16 rounded-full mb-3 ${activeStep === index
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                  : completedSteps.includes(index)
                    ? 'bg-red-200 text-red-700'
                    : 'bg-gray-100 text-gray-500'
                  }`}
                animate={activeStep === index ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {step.icon}
                {completedSteps.includes(index) && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6L5 8L9 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
              <h3 className={`font-medium text-base mb-1 ${activeStep === index ? 'text-red-600 font-bold' : ''}`}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground text-center">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
