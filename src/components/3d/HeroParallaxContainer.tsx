'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroParallaxContainer: React.FC<HeroParallaxContainerProps> = ({
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // 3D perspective fold down as user scrolls
  const rotateX = useTransform(scrollYProgress, [0, 0.45], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.45], [40, 0]);

  return (
    <div
      ref={containerRef}
      className={`[perspective:1200px] w-full ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformStyle: 'preserve-3d'
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};
