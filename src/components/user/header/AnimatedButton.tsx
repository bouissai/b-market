import {motion} from 'framer-motion';
import {Button} from "@/components/ui/button";
import {ElementType, ReactNode} from "react";


interface AnimatedButtonProps {
    children: ReactNode;
    Icon: ElementType; // Type pour les composants React, ici pour les icônes Lucide
    onClick?: () => void; // Ajouter onClick comme prop
    variant?:"link" | "outline" | "default" | "destructive" | "secondary" | "ghost" | null | undefined
}


const AnimatedButton = ({children, Icon, onClick,variant}: AnimatedButtonProps) => {
    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="relative inline-block hover:scale-110"
        >
            <Button variant={variant} className="flex items-center justify-center overflow-hidden" onClick={onClick}>
                <motion.span
                    variants={{
                        rest: {x: 0, opacity: 1},
                        hover: {x: 50, opacity: 0}
                    }}
                    transition={{type: "spring", stiffness: 300, damping: 20}}
                    className="flex items-center gap-2"
                >
                    <Icon size={40}/> {children}
                </motion.span>

                <motion.div
                    variants={{
                        rest: {opacity: 0},
                        hover: {opacity: 1}
                    }}
                    transition={{type: "spring", stiffness: 300, damping: 20}}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Icon/>
                </motion.div>
            </Button>
        </motion.div>
    );
};

export default AnimatedButton;
