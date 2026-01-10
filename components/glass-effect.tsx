"use client";

import React from "react";

// Types
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
}

// Glass Effect Wrapper Component
export const GlassEffect: React.FC<GlassEffectProps> = ({ children, className = "", style = {}, href, target = "_blank" }) => {
  const glassStyle = {
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div className={`relative flex overflow-hidden text-white cursor-pointer transition-all duration-700 rounded-3xl backdrop-blur-lg ${className}`} style={glassStyle}>
      {/* Glass Highlights */}
      <div
        className="absolute inset-0 z-10 opacity-30"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, transparent 50%)",
          borderRadius: "inherit",
        }}
      />
      
      {/* Subtle Inner Border */}
      <div
        className="absolute inset-0 z-20 rounded-inherit overflow-hidden"
        style={{
          boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
          borderRadius: "inherit",
        }}
      />

      {/* Content */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};
