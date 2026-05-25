"use client";
import { useEffect, useState } from "react";

interface BackgroundLoaderProps {
  placeholder: string;
  optimized: string;
  children: React.ReactNode;
  className?: string;
}

export function BackgroundLoader({ placeholder, optimized, children, className = "" }: BackgroundLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const imgSrc = loaded ? optimized : placeholder;

  useEffect(() => {
    const img = new Image();
    img.src = optimized;
    img.onload = () => setLoaded(true);
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