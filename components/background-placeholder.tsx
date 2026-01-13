"use client";
import { useEffect, useState } from "react";

interface BackgroundLoaderProps {
  placeholder: string;
  optimized: string;
  children: React.ReactNode;
  className?: string;
}

export function BackgroundLoader({ placeholder, optimized, children, className = "" }: BackgroundLoaderProps) {
  const [imgSrc, setImgSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = optimized;
    img.onload = () => {
      setImgSrc(optimized);
      setIsLoaded(true);
    };
  }, [optimized]);

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}