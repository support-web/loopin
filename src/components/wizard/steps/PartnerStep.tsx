'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AI_PERSONALITIES, type AIPersonality } from '@/types';
import { useWizardStore } from '@/stores/wizardStore';

export function PartnerStep() {
  const { data, updateData } = useWizardStore();

  const handleSelect = (personality: AIPersonality) => {
    updateData({ aiPersonality: personality });
  };

  return (
    <div>
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          AIパートナーを選択
        </h2>
        <p className="text-slate-600">
          壁打ち相手のスタイルを選んでください
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {AI_PERSONALITIES.map((personality, index) => {
          const isSelected = data.aiPersonality === personality.id;

          return (
            <motion.button
              key={personality.id}
              onClick={() => handleSelect(personality.id)}
              className={cn(
                'relative p-6 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden',
                'hover:shadow-xl',
                isSelected
                  ? 'border-transparent shadow-xl'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.1,
              }}
              whileHover={{
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 10 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient background for selected */}
              {isSelected && (
                <motion.div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-10',
                    personality.color
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                />
              )}

              <div className="relative z-10">
                <motion.div
                  className="flex items-center gap-4 mb-4"
                  animate={{
                    x: isSelected ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <motion.div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl',
                      'bg-gradient-to-br',
                      personality.color
                    )}
                    animate={{
                      scale: isSelected ? [1, 1.1, 1] : 1,
                      rotate: isSelected ? [0, -5, 5, 0] : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    {personality.icon}
                  </motion.div>
                  <div>
                    <h3
                      className={cn(
                        'text-lg font-bold',
                        isSelected ? 'text-slate-900' : 'text-slate-700'
                      )}
                    >
                      {personality.name}
                    </h3>
                    {isSelected && (
                      <motion.span
                        className={cn(
                          'inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1',
                          'bg-gradient-to-r text-white',
                          personality.color
                        )}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 15,
                        }}
                      >
                        選択中
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {personality.description}
                </p>
              </div>

              {/* Border gradient for selected */}
              {isSelected && (
                <motion.div
                  className={cn(
                    'absolute inset-0 rounded-2xl border-2 border-transparent',
                    'bg-gradient-to-br',
                    personality.color
                  )}
                  style={{
                    WebkitMask:
                      'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
