'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceWaveformProps {
  audioLevel: number;
  isActive: boolean;
  barCount?: number;
}

export function VoiceWaveform({
  audioLevel,
  isActive,
  barCount = 5,
}: VoiceWaveformProps) {
  // Generate random heights based on audio level
  const generateHeight = (index: number) => {
    if (!isActive) return 0.2;

    const baseHeight = 0.2;
    const variation = Math.sin((Date.now() / 100 + index * 0.5)) * 0.3;
    const levelBoost = audioLevel * 0.8;

    return Math.min(1, Math.max(baseHeight, baseHeight + variation + levelBoost));
  };

  return (
    <div className="flex items-center justify-center gap-1 h-6">
      {[...Array(barCount)].map((_, index) => {
        const height = generateHeight(index);

        return (
          <motion.div
            key={index}
            className={cn(
              'w-1 rounded-full',
              isActive ? 'bg-white' : 'bg-white/50'
            )}
            animate={{
              height: isActive ? `${height * 24}px` : '6px',
              opacity: isActive ? 1 : 0.5,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
              mass: 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

// Alternative circular pulsing visualization
export function VoicePulse({ audioLevel, isActive }: Omit<VoiceWaveformProps, 'barCount'>) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Outer pulse rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={{
              scale: [1, 1.5 + audioLevel * 0.5],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={{
              scale: [1, 1.5 + audioLevel * 0.5],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 1,
              delay: 0.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </>
      )}

      {/* Center circle */}
      <motion.div
        className="w-8 h-8 rounded-full bg-white/30"
        animate={{
          scale: isActive ? 1 + audioLevel * 0.3 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 15,
        }}
      />
    </div>
  );
}
