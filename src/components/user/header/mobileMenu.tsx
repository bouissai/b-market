import { MENU_ITEMS } from '@/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { OrderButton } from './basketButton';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t"
            >
                <div className="px-4 py-6 space-y-4">
                    {MENU_ITEMS.map((item) => (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            className="block text-gray-600 hover:text-red-700"
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                        >
                            {item.label}
                        </motion.a>
                    ))}
                    <motion.a
                        key='panier'
                        href='/panier'
                        className="block text-gray-600 hover:text-red-700"
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                    >
                        Mon Panier
                    </motion.a>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);