import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ThreeDTiltCardProps {
  children: React.ReactNode;
  className?: string;
  glareEffect?: boolean;
  maxTilt?: number;
  scale?: number;
  onClick?: () => void;
}

export const ThreeDTiltCard: React.FC<ThreeDTiltCardProps> = ({
  children,
  className = '',
  glareEffect = true,
  maxTilt = 10,
  scale = 1.02,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if the primary input is touch/coarse pointer
    const checkTouch = () => {
      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      setIsTouchDevice(isTouch);
    };
    checkTouch();
  }, []);

  // Raw mouse position relative to center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Framer-motion spring physics for organic, buttery momentum
  const springConfig = { damping: 22, stiffness: 280, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // 3D rotation transforms
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Glare highlight coordinates
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.18, 0, 0.18]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    x.set(0);
    y.set(0);
  };

  if (isTouchDevice) {
    return (
      <motion.div
        ref={cardRef}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={`relative transition-colors duration-200 ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div style={{ perspective: 1200 }} className="w-full h-full">
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale,
          boxShadow: '0 20px 35px -10px rgba(255, 122, 80, 0.22), 0 10px 15px -5px rgba(10, 25, 47, 0.12)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={`relative transition-colors duration-200 cursor-pointer ${className}`}
      >
        <div style={{ transform: 'translateZ(14px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>

        {/* Specular Peach/White Glare Overlay on Tilt */}
        {glareEffect && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden mix-blend-overlay"
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(circle 260px at ${glareX} ${glareY}, rgba(255, 235, 220, 0.7), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
