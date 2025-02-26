"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Home, Package, PackageCheck, ShoppingBag, UserCheck } from "lucide-react"
import { useState } from "react"

interface Step {
    icon: JSX.Element
    title: string
    number: number
}

export default function ClickAndCollect() {
    const [currentStep, setCurrentStep] = useState(1)

    const steps: Step[] = [
        { icon: <Home />, title: "Je choisis mes produits", number: 1 },
        { icon: <ShoppingBag />, title: "Je valide mon panier", number: 2 },
        { icon: <UserCheck />, title: "La commande est accepté", number: 3 },
        { icon: <Package />, title: "La commande est prête", number: 4 },
        { icon: <PackageCheck />, title: "Je récupère ma commande", number: 5 },
    ]

    return (
        <section id="click-collect">
            <div>
                <div>
                    <h1 className="text-2xl font-bold mb-6">Click & Collect</h1>
                    <span className="text-xl mb-8">Gagner du temps en reservant par téléphone ou directement sur le site</span>
                </div>
                <div className="relative mt-8">
                    <div className="relative z-10 flex justify-between items-center">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex flex-col items-center px-11">
                                <motion.div
                                    className={cn(
                                        "w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer relative",
                                        currentStep >= step.number ? "text-red-800" : "text-gray-400",
                                    )}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setCurrentStep(step.number)}
                                >
                                    {/* Animated circle background */}
                                    {currentStep >= step.number && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-white"
                                            layoutId="activeStep"
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div className="relative z-10">{step.icon}</div>

                                    {/* Step number */}
                                    <motion.div
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center"
                                        initial={false}
                                        animate={{
                                            scale: currentStep === step.number ? 1.2 : 1,
                                        }}
                                    >
                                        {step.number}
                                    </motion.div>
                                </motion.div>

                                {/* Step title */}
                                <motion.p
                                    className={cn(
                                        "mt-4 text-sm font-medium text-center max-w-[120px]",
                                        currentStep >= step.number ? "text-gray-900" : "text-gray-400",
                                    )}
                                    initial={false}
                                    animate={{
                                        scale: currentStep === step.number ? 1.05 : 1,
                                    }}
                                >
                                    {step.title}
                                </motion.p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

