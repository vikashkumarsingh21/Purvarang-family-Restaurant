import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { getImageUrl } from '../../data/images';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto' | '4/3';
  fallbackText?: string;
  category?: string;
  photoFrame?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  fallbackText,
  category,
  photoFrame = false,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(!src);

  const resolvedSrc = src ? getImageUrl(src) : '';

  // Synchronize state when src changes and check if image is already cached/complete on mount
  useEffect(() => {
    if (!resolvedSrc) {
      setError(true);
      setLoaded(false);
      return;
    }

    setError(false);

    // If already complete in cache upon mount or src change
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      } else if (imgRef.current.naturalWidth === 0 && imgRef.current.src) {
        setError(true);
        setLoaded(true);
      }
    }

    // Safety timeout: Ensure image never stays at opacity 0 indefinitely
    const timer = setTimeout(() => {
      if (imgRef.current) {
        if (imgRef.current.complete && imgRef.current.naturalWidth === 0) {
          setError(true);
        }
        setLoaded(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [src, resolvedSrc]);

  // Ref callback to capture immediately-cached images upon DOM mount
  const setImgRef = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node && node.complete) {
      if (node.naturalWidth > 0) {
        setLoaded(true);
      } else if (node.naturalWidth === 0 && node.src) {
        setError(true);
        setLoaded(true);
      }
    }
  }, []);

  const ratioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    auto: 'min-h-[140px]',
  };

  const frameClass = photoFrame ? "p-1.5 bg-white border border-wheat shadow-soft rounded-[10px]" : "";

  if (error || !resolvedSrc) {
    return (
      <div
        className={`w-full ${ratioClasses[aspectRatio]} bg-paper border border-wheat rounded-[8px] flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-cream border border-wheat flex items-center justify-center text-clay mb-2 shadow-xs">
          <UtensilsCrossed className="w-5 h-5 stroke-[1.75]" />
        </div>
        <p className="text-[14px] font-serif text-espresso font-semibold">
          {fallbackText || alt || (category ? `${category} Specialty` : 'Purvarang Specialty')}
        </p>
        {category && (
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider bg-cream border border-wheat text-mirchi">
            {category}
          </span>
        )}
        <span className="text-[11px] text-clay uppercase tracking-wider mt-1">
          Tinpulwa Chowk, Lalganj
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[8px] ${frameClass} ${ratioClasses[aspectRatio]} ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-paper/70 animate-pulse border border-wheat flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-wheat border-t-mirchi rounded-full animate-spin" />
        </div>
      )}
      <img
        ref={setImgRef}
        src={resolvedSrc}
        alt={alt || "Purvarang Restaurant"}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`w-full h-full object-cover transition-all duration-300 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
        }`}
        {...props}
      />
    </div>
  );
};
