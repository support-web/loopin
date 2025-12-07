'use client';

import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  animation?: 'fadeIn' | 'slideUp' | 'slideRight' | 'scale' | 'bounce';
  delay?: number;
  duration?: number;
  stagger?: boolean;
  staggerChildren?: number;
}

const animations: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  bounce: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
  },
};

export function AnimatedContainer({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  stagger = false,
  staggerChildren = 0.1,
  className,
  ...props
}: AnimatedContainerProps) {
  const containerVariants: Variants = stagger
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }
    : animations[animation];

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={
        !stagger
          ? {
              duration,
              delay,
              type: animation === 'bounce' ? 'spring' : 'tween',
              ease: 'easeOut',
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

// 子要素用のアニメーションラッパー
export function AnimatedItem({
  children,
  animation = 'slideUp',
  className,
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={animations[animation]}
      transition={{
        type: animation === 'bounce' ? 'spring' : 'tween',
        stiffness: 300,
        damping: 20,
        duration: 0.4,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ページトランジション用
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}
