"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface HoverLinkPreviewProps {
  href: string;
  previewImage: string;
  imageAlt?: string;
  children: React.ReactNode;
}

const PREVIEW_WIDTH = 192;
const PREVIEW_HEIGHT = 112;
const OFFSET_Y = 16;

const HoverLinkPreview: React.FC<HoverLinkPreviewProps> = ({ href, previewImage, imageAlt = "Link preview", children }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const prevX = useRef<number | null>(null);

  const isVideo = React.useMemo(() => {
    return /\.(mp4|mov|webm)$/i.test(previewImage);
  }, [previewImage]);

  // Motion values — start offscreen so spring never "flies" from 0,0
  const motionTop = useMotionValue(-9999);
  const motionLeft = useMotionValue(-9999);
  const motionRotate = useMotionValue(0);

  // Springs for natural movement
  const springTop = useSpring(motionTop, { stiffness: 350, damping: 30 });
  const springLeft = useSpring(motionLeft, { stiffness: 350, damping: 30 });
  const springRotate = useSpring(motionRotate, { stiffness: 300, damping: 20 });

  // Mount portal only on client to avoid SSR mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const calcPosition = (e: React.MouseEvent) => ({
    top: e.clientY - PREVIEW_HEIGHT - OFFSET_Y,
    left: e.clientX - PREVIEW_WIDTH / 2,
  });

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { top, left } = calcPosition(e);
    // jump() sets value instantly (no spring interpolation on first render)
    motionTop.jump(top);
    motionLeft.jump(left);
    motionRotate.jump(0);
    prevX.current = e.clientX;
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
    prevX.current = null;
    motionRotate.set(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { top, left } = calcPosition(e);
    motionTop.set(top);
    motionLeft.set(left);

    if (prevX.current !== null) {
      const deltaX = e.clientX - prevX.current;
      const newRotate = Math.max(-12, Math.min(12, deltaX * 1.2));
      motionRotate.set(newRotate);
    }
    prevX.current = e.clientX;
  };

  const preview = (
    <AnimatePresence>
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          style={{
            position: "fixed",
            top: springTop,
            left: springLeft,
            rotate: springRotate,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div
            className="rounded-xl shadow-xl overflow-hidden border border-white/10"
            style={{ width: PREVIEW_WIDTH }}
          >
            {isVideo ? (
              <video
                src={previewImage}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, objectFit: "cover", display: "block" }}
              />
            ) : (
              <img
                src={previewImage}
                alt={imageAlt}
                draggable={false}
                style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, objectFit: "cover", display: "block" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-block cursor-pointer text-blue-500 underline underline-offset-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>

      {/* Portal renders directly into document.body — completely outside the MDX <p> tree */}
      {mounted && createPortal(preview, document.body)}
    </>
  );
};

export { HoverLinkPreview };
