import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  distance?: number;
  className?: string;
  scale?: number;
  viewportMargin?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.55,
  distance = 24,
  className = '',
  scale = 1,
  viewportMargin = '-40px',
  ...rest
}) => {
  const getInitialOffsets = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const offsets = getInitialOffsets();

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offsets,
        scale: scale !== 1 ? scale : 0.985,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth cubic bezier from algo-flow
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  viewportMargin?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
  viewportMargin = '-40px',
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export const StaggerCard: React.FC<StaggerCardProps> = ({
  children,
  className = '',
  index = 0,
  ...rest
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const FlowConnectingRail: React.FC<{ activeIndex: number; total: number }> = ({
  activeIndex,
  total,
}) => {
  return (
    <div className="relative w-full h-1.5 my-3 hidden lg:block overflow-hidden rounded-full bg-slate-200/80">
      <motion.div
        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${(activeIndex / total) * 100}%` }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-sheen pointer-events-none" />
    </div>
  );
};
