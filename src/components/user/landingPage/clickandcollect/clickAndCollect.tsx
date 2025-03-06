"use client";

import { animations } from "@/utils/animation";
import { motion, useInView } from "framer-motion";
import { ChefHat, ClipboardCheck, Clock, ShoppingBag } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Step from "./step";

export default function ClickCollectSteps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { icon: <ShoppingBag size={28} />, title: "Commandez en ligne", description: "Sélectionnez vos produits et personnalisez votre commande." },
    { icon: <ClipboardCheck size={28} />, title: "Validation", description: "Notre équipe vérifie votre commande et confirme sa disponibilité." },
    { icon: <ChefHat size={28} />, title: "Préparation", description: "Notre artisan boucher prépare votre commande avec soin." },
    { icon: <Clock size={28} />, title: "Retrait en magasin", description: "Venez chercher votre commande à l'heure choisie." }
  ];

  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index);
    setCompletedSteps((prev) => [...new Set([...prev, ...Array.from({ length: index }, (_, i) => i)])]);
  }, []);

  return (
    <div ref={ref} className="min-h-10 text-center w-full mx-auto py-12 px-4">
      <motion.h2
            variants={animations.withDelay(animations.fadeInDown, 0.2)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
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
Commander en ligne et récupérer vos achats directement en magasin..      </motion.p>

      <div className="relative mt-10">
        {/* Barre de progression */}
        <div className="absolute top-8 left-4 right-4 h-1 bg-gray-200 z-0">
          <motion.div
            className="absolute top-0 left-0 h-full bg-red-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((activeStep) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex justify-around relative z-10">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isActive={activeStep === index}
              isCompleted={completedSteps.includes(index)}
              onClick={() => handleStepClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
