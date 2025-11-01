'use client';

import { useState, useRef, useEffect } from 'react';

interface LazyVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function LazyVideo({ src, className, autoPlay = true, muted = true, loop = true }: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [isLoaded]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={autoPlay && isLoaded}
      muted={muted}
      loop={loop}
      playsInline
      preload="none"
    >
      {isLoaded && <source src={src} type="video/mp4" />}
    </video>
  );
}