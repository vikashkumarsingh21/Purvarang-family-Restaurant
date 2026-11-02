import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto' | '4/3';
  fallbackText?: string;
  photoFrame?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  fallbackText,
  photoFrame = false,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(!src);

  const ratioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    auto: '',
  };

  const frameClass = photoFrame ? "p-1.5 bg-white border border-wheat shadow-soft rounded-[10px]" : "";

  if (error || !src) {
    return (
      <div
        className={`w-full ${ratioClasses[aspectRatio]} bg-paper border border-wheat rounded-[8px] flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <div className="w-9 h-9 rounded-full bg-cream border border-wheat flex items-center justify-center text-clay mb-2">
          <UtensilsCrossed className="w-4 h-4 stroke-[1.75]" />
        </div>
        <p className="text-[14px] font-serif text-espresso font-semibold">
          {fallbackText || alt || 'Purvarang Dish'}
        </p>
        <span className="text-[11px] text-clay uppercase tracking-wider mt-0.5">
          Tinpulwa Chowk, Lalganj
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[8px] ${frameClass} ${ratioClasses[aspectRatio]} ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-paper/70 animate-pulse border border-wheat flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-wheat border-t-mirchi rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt || "Purvarang Restaurant"}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-300 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
        }`}
        {...props}
      />
    </div>
  );
};
