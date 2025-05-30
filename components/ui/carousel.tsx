import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface CarouselImagesProps {
  images: { src: string; alt?: string }[];
  className?: string;
  imageClassName?: string;
  intervalMs?: number;
}

export const CarouselImages: React.FC<CarouselImagesProps> = ({
  images,
  className = '',
  imageClassName = '',
  intervalMs = 5000,
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, images.length, intervalMs]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };
  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  if (!images.length) return null;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[current].src || '/images/Andariegos.jpg'}
            alt={images[current].alt || ''}
            fill
            className={`object-cover ${imageClassName}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </motion.div>
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-1 shadow"
            aria-label="Anterior"
            tabIndex={0}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-1 shadow"
            aria-label="Siguiente"
            tabIndex={0}
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </>
      )}
      {/* Indicadores */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${idx === current ? 'bg-yellow-400' : 'bg-gray-300'} transition-all`}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 