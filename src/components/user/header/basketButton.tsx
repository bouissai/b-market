import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface BasketButtonProps {
    className?: string;
}

export const BasketButton = ({ className = "" }: BasketButtonProps) => (
    <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="#click-collect"
        className={`relative flex items-center ${className}`}
    >
        <Button variant={'link'}>
            <motion.span
                variants={{
                    rest: { x: 0, opacity: 1 },
                    hover: { x: 50, opacity: 0 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-2"
            >
                <ShoppingBag/>
                <span>Panier</span>
                <Badge>0</Badge>
            </motion.span>
        </Button>
    </motion.a>
);