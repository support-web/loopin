'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WIZARD_STEPS } from '@/types';

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />

        {/* Progress line active */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentStep / (WIZARD_STEPS.length - 1)) * 100}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
          }}
        />

        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center z-10"
            >
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
                  'transition-colors duration-300',
                  isCompleted
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-primary-500 text-primary-600'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 15,
                }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  index + 1
                )}
              </motion.div>

              <motion.div
                className="mt-2 text-center"
                animate={{
                  opacity: isCurrent ? 1 : 0.6,
                }}
              >
                <p
                  className={cn(
                    'text-xs font-medium',
                    isCurrent ? 'text-primary-600' : 'text-slate-500'
                  )}
                >
                  {step.title}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
