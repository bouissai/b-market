'use client';

import { MENU_ITEMS } from "@/constants";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BasketButton } from "./basketButton";
import { MobileMenu } from "./mobileMenu";

export function HeaderUser() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div><h1>Logo</h1></div>

        {/* Menu mobile toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-red-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-8">
          {MENU_ITEMS.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        {/* Desktop basket button */}
        <div className="hidden md:block">
          <BasketButton />
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </motion.header>
  );
}