'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GENRE_OPTIONS } from '@/types';
import { useWizardStore } from '@/stores/wizardStore';
import {
  Laptop,
  Gamepad2,
  Users,
  GraduationCap,
  Heart,
  Coins,
  ShoppingBag,
  UtensilsCrossed,
  MoreHorizontal,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  saas: Laptop,
  entertainment: Gamepad2,
  hr: Users,
  education: GraduationCap,
  healthcare: Heart,
  fintech: Coins,
  ec: ShoppingBag,
  food: UtensilsCrossed,
  other: MoreHorizontal,
};

export function GenreStep() {
  const { data, updateData } = useWizardStore();

  const handleSelect = (value: string) => {
    updateData({ genre: value });
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
          ビジネスジャンルを選択
        </h2>
        <p className="text-slate-600">
          あなたの事業アイデアはどの分野に近いですか？
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {GENRE_OPTIONS.map((option, index) => {
          const Icon = iconMap[option.value] || MoreHorizontal;
          const isSelected = data.genre === option.value;

          return (
            <motion.button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'p-6 rounded-2xl border-2 text-left transition-all duration-200',
                'hover:shadow-lg',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 10 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                  isSelected ? 'bg-primary-500' : 'bg-slate-100'
                )}
                animate={{
                  rotate: isSelected ? [0, -10, 10, 0] : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <Icon
                  className={cn(
                    'w-6 h-6',
                    isSelected ? 'text-white' : 'text-slate-600'
                  )}
                />
              </motion.div>
              <p
                className={cn(
                  'font-semibold',
                  isSelected ? 'text-primary-700' : 'text-slate-700'
                )}
              >
                {option.label}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
