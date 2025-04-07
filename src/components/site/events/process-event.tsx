"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

export function ProcessEvents() {
    const [activeStep, setActiveStep] = useState(0)

    const steps = [
        {
            title: "Contactez-nous",
            description: "Remplissez notre formulaire ou appelez-nous pour discuter de vos besoins.",
        },
        { title: "Devis personnalisé", description: "Nous vous préparons un devis adapté à votre événement et budget." },
        { title: "Confirmation", description: "Validez votre commande et choisissez votre mode de livraison." },
        { title: "Livraison", description: "Nous livrons votre commande fraîche et prête pour votre événement." },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prevStep) => (prevStep + 1) % steps.length)
        }, 3000) // Slightly longer interval for better readability

        return () => clearInterval(interval)
    }, [steps.length])

    return (
        <div className="container mx-auto px-6 py-12">
            <div
                className="text-center mb-12"
            >
                <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Un processus simple en 4 étapes pour vous fournir la meilleure viande pour votre événement.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        className={`p-6 rounded-lg border shadow-sm text-center relative ${activeStep === index
                            ? "bg-gradient-to-br from-red-50 to-white border-red-200"
                            : "bg-white/95 border-gray-100"
                            }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100,
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`circle-${activeStep === index ? "active" : "inactive"}`}
                                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${activeStep === index ? "bg-red-800 text-white" : "bg-primary/10 text-primary"
                                    }`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="font-bold text-xl relative z-10">{index + 1}</span>
                            </motion.div>
                        </AnimatePresence>

                        <motion.h3
                            className="text-xl font-semibold mb-3"
                            animate={{
                                color: activeStep === index ? "#991b1b" : "#1f2937",
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {step.title}
                        </motion.h3>

                        <motion.p
                            className="text-muted-foreground"
                            animate={{
                                opacity: activeStep === index ? 1 : 0.7,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {step.description}
                        </motion.p>
                        {index < steps.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 -right-7 transform -translate-y-1/2 z-10">
                                <div>
                                    <ArrowRight size={24} className={activeStep === index ? "text-red-800" : "text-gray-400"} />
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}

            </div>
        </div>
    )
}

