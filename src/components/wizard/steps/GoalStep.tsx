'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { REVENUE_GOAL_OPTIONS, START_TIMING_OPTIONS } from '@/types';
import { useWizardStore } from '@/stores/wizardStore';
import { Target, Calendar } from 'lucide-react';

export function GoalStep() {
  const { data, updateData } = useWizardStore();

  return (
    <div>
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          目標と時期を設定
        </h2>
        <p className="text-slate-600">
          目指す売上規模と事業開始時期を教えてください
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Revenue Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-slate-800">売上目標</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {REVENUE_GOAL_OPTIONS.map((option, index) => {
              const isSelected = data.revenueGoal === option.value;

              return (
                <motion.button
                  key={option.value}
                  onClick={() => updateData({ revenueGoal: option.value })}
                  className={cn(
                    'p-4 rounded-xl border-2 text-center transition-all duration-200',
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.3 + index * 0.05,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p
                    className={cn(
                      'font-medium',
                      isSelected ? 'text-primary-700' : 'text-slate-700'
                    )}
                  >
                    {option.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Start Timing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-600" />
            </div>
            <h3 className="font-semibold text-slate-800">開始時期</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {START_TIMING_OPTIONS.map((option, index) => {
              const isSelected = data.startTiming === option.value;

              return (
                <motion.button
                  key={option.value}
                  onClick={() => updateData({ startTiming: option.value })}
                  className={cn(
                    'p-4 rounded-xl border-2 text-center transition-all duration-200',
                    isSelected
                      ? 'border-accent-500 bg-accent-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.5 + index * 0.05,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p
                    className={cn(
                      'font-medium',
                      isSelected ? 'text-accent-700' : 'text-slate-700'
                    )}
                  >
                    {option.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
