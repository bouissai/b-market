"use client"

import { Button } from "@/components/ui/button"
import { Review } from "@/store/useReviewStore"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useEffect, useState } from "react"


type ReviewProps = {
  reviews: Review[];
}

export function TestimonialsCarousel({ reviews }: ReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const currentTestimonial = reviews[currentIndex]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-muted/20 rounded-2xl p-12 md:p-16">
        <Quote className="w-12 h-12 text-muted-foreground/30 mb-8" />

        <blockquote className="text-xl md:text-2xl font-light text-foreground leading-relaxed mb-8 text-balance">
          "{currentTestimonial.quote}"
        </blockquote>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-light text-foreground text-lg">{currentTestimonial.name}</div>
            <div className="text-sm text-muted-foreground font-light">{currentTestimonial.role}</div>
          </div>

          <div className="flex gap-1">
            {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
              <svg key={i} className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button variant="ghost" size="icon" onClick={goToPrevious} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-foreground w-8" : "bg-muted-foreground/30"
                }`}
            />
          ))}
        </div>

        <Button variant="ghost" size="icon" onClick={goToNext} className="rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
