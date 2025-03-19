"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { LES_VALEURS } from "@/constants"

export function NosValeurs() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2, // Trigger when 20% of the element is in view
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto" aria-labelledby="section-values-title">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="space-y-12"
      >
        <h2 id="section-values-title" className="text-4xl md:text-5xl text-center font-bold">
          Nos Valeurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LES_VALEURS.map((value) => (
            <motion.div key={value.id} variants={cardVariants} className="h-full">
              <Card
                className="h-full bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                role="region"
                aria-labelledby={`card-title-${value.id}`}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 h-full">
                  <div className="text-primary group-hover:text-red-600 transition-colors duration-300">
                    <value.icon strokeWidth="1.6" size="56" />
                  </div>

                  <h3
                    id={`card-title-${value.id}`}
                    className="text-center text-2xl md:text-3xl font-semibold group-hover:text-red-600 transition-colors duration-300"
                  >
                    {value.title}
                  </h3>

                  <p className="text-center text-gray-600 text-base md:text-lg">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

