import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import * as React from "react";
import { ElementType } from "react";

interface AnimatedButtonProps extends ButtonProps {
    Icon: ElementType;
    size?: "default" | "sm" | "lg" | "icon";
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ children, Icon, onClick, variant, type, className, size = "default", ...props }, ref) => {
        return (
            <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="w-full relative inline-block"
            >
                <Button
                    ref={ref}
                    type={type}
                    variant={variant}
                    size={size}
                    className={className}
                    onClick={onClick}
                    {...props}
                >
                    <motion.span
                        variants={{
                            rest: { x: 0, opacity: 1 },
                            hover: { x: 50, opacity: 0 }
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center gap-2"
                    >
                        <Icon size={size === "icon" ? 16 : 20} /> {children}
                    </motion.span>

                    <motion.div
                        variants={{
                            rest: { opacity: 0 },
                            hover: { opacity: 1 }
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Icon size={size === "icon" ? 16 : 20} />
                    </motion.div>
                </Button>
            </motion.div>
        );
    });

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;
