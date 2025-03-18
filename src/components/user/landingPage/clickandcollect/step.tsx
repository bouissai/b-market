'use client'

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isActive: boolean;
    isCompleted: boolean;
    onClick: () => void;
}

export default function Step({ icon, title, description, isActive, isCompleted, onClick }: StepProps) {
    return (
        <motion.div
            className={`relative flex flex-col items-center cursor-pointer ${isActive ? 'z-10' : ''}`}
            whileHover={{ scale: isActive ? 1 : 1.05 }}
            onClick={onClick}
        >
            {/* Cercle d'étape */}
            <motion.div
                className={`relative flex items-center justify-center w-16 h-16 rounded-full border-4
          ${isCompleted
                        ? 'bg-green-600 border-green-200 text-white'
                        : isActive
                            ? 'bg-red-600 border-red-200 text-white'
                            : 'bg-white border-gray-200 text-gray-400'
                    }`}
                initial={false}
                animate={isActive && !isCompleted ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isActive && !isCompleted ? Infinity : 0, repeatDelay: 2 }}
            >
                {isCompleted ? <Check size={28} className="text-white" /> : icon}
            </motion.div>

            {/* Contenu de l'étape */}
            <div className="mt-4 text-center max-w-[200px]">
                <h3 className={`font-bold mb-1 ${isActive ? '' : 'text-gray-500'}`}>
                    {title}
                </h3>
                <AnimatePresence>
                    {isActive && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-gray-600"
                        >
                            {description}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
