'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { STRENGTH_OPTIONS } from '@/types';
import { useWizardStore } from '@/stores/wizardStore';
import {
  Code,
  Handshake,
  BarChart2,
  Palette,
  Award,
  Network,
  BookOpen,
  Wallet,
} from 'lucide-react';
import { Check } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  tech: Code,
  sales: Handshake,
  marketing: BarChart2,
  design: Palette,
  brand: Award,
  network: Network,
  domain: BookOpen,
  capital: Wallet,
};

export function StrengthsStep() {
  const { data, updateData } = useWizardStore();
  const selectedStrengths = data.strengths || [];

  const toggleStrength = (value: string) => {
    const newStrengths = selectedStrengths.includes(value)
      ? selectedStrengths.filter((s) => s !== value)
      : [...selectedStrengths, value];
    updateData({ strengths: newStrengths });
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
          あなたの強みを選択
        </h2>
        <p className="text-slate-600">
          事業に活かせる強みを選んでください（複数選択可）
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {STRENGTH_OPTIONS.map((option, index) => {
          const Icon = iconMap[option.value] || Code;
          const isSelected = selectedStrengths.includes(option.value);

          return (
            <motion.button
              key={option.value}
              onClick={() => toggleStrength(option.value)}
              className={cn(
                'relative p-5 rounded-2xl border-2 transition-all duration-200',
                'hover:shadow-lg',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.05,
                transition: { type: 'spring', stiffness: 400, damping: 10 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Check badge */}
              <motion.div
                className={cn(
                  'absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full',
                  'flex items-center justify-center'
                )}
                initial={false}
                animate={{
                  scale: isSelected ? 1 : 0,
                  opacity: isSelected ? 1 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>

              <motion.div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3',
                  isSelected ? 'bg-primary-500' : 'bg-slate-100'
                )}
                animate={{
                  rotate: isSelected ? [0, -15, 15, 0] : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <Icon
                  className={cn(
                    'w-5 h-5',
                    isSelected ? 'text-white' : 'text-slate-600'
                  )}
                />
              </motion.div>
              <p
                className={cn(
                  'text-sm font-medium text-center',
                  isSelected ? 'text-primary-700' : 'text-slate-700'
                )}
              >
                {option.label}
              </p>
            </motion.button>
          );
        })}
      </div>

      {selectedStrengths.length > 0 && (
        <motion.p
          className="text-center text-sm text-slate-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {selectedStrengths.length}個選択中
        </motion.p>
      )}
    </div>
  );
}
