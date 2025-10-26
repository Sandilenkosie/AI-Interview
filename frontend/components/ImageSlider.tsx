"use client";

import { useState, useEffect } from "react";

interface ImageSliderProps {
  images: string[];
  autoSlideInterval?: number;
}

export default function ImageSlider({ images, autoSlideInterval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval]);


  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-96 object-cover"
            />
          ))}
        </div>
      </div>

    </div>
  );
}