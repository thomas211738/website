import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
  /** Array of image URLs */
  images: string[]
  /**
   * Auto-scroll interval in milliseconds (default is 5000 ms)
   */
  interval?: number
}

const ImageCarousel: React.FC<CarouselProps> = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isAutoPlaying) {
      timer = setInterval(() => {
        goToNext()
      }, interval)
    }

    return () => clearInterval(timer)
  }, [isAutoPlaying, interval])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div
      className="w-full max-w-3xl mx-auto flex flex-col items-center"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Rounded container with overflow hidden */}
      <div className="relative w-full overflow-hidden rounded-2xl">
        {/* Slides container */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>

        {/* Previous button (slightly inside) */}
        <button
          onClick={goToPrevious}
          className="
            absolute 
            left-0
            top-1/2 
            -translate-y-1/2 
            z-10
            bg-black/50 
            text-white 
            p-2 
            rounded-full 
            hover:bg-black/75 
            transition-colors
          "
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next button (slightly inside) */}
        <button
          onClick={goToNext}
          className="
            absolute 
            right-0
            top-1/2 
            -translate-y-1/2 
            z-10
            bg-black/50 
            text-white 
            p-2 
            rounded-full 
            hover:bg-black/75 
            transition-colors
          "
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots below the image */}
      <div className="mt-4 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full border-2 border-white transition-colors ${
              index === currentIndex ? 'bg-black' : 'bg-black/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
