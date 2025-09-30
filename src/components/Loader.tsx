// src/components/Loader.tsx
import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-navy overflow-hidden">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Glowing Orb */}
        <div className="absolute w-24 h-24 bg-gold rounded-full animate-orb-glow flex items-center justify-center text-navy text-5xl font-dancing">
          W
        </div>

        {/* Orbiting Text */}
        <div className="absolute w-full h-full animate-orbit-cw">
          <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-gold font-dancing text-4xl animate-text-fade">
            Wen
          </p>
        </div>
        <div className="absolute w-full h-full animate-orbit-ccw">
          <p className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full text-gold font-ruwudu text-4xl animate-text-fade-delay">
            وين
          </p>
        </div>

        {/* Stars */}
        <div className="absolute w-full h-full animate-spin-slow">
          <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-star-twinkle"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full animate-star-twinkle animation-delay-300"></div>
          <div className="absolute top-1/4 left-3/4 w-1 h-1 bg-white rounded-full animate-star-twinkle animation-delay-500"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-star-twinkle animation-delay-700"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;