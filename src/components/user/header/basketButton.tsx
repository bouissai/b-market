import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

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
            <motion.span
                variants={{
                    rest: { x: 0, opacity: 1 },
                    hover: { x: 50, opacity: 0 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-2"
            >
            <Button variant="ghost" className="relative">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Mon panier
                <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                  0
                </Badge>
            </Button>
            </motion.span>
    </motion.a>
);