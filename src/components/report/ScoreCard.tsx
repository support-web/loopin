'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AnalysisScores } from '@/types';
import {
  Lightbulb,
  TrendingUp,
  Target,
  DollarSign,
  Rocket,
  Users,
} from 'lucide-react';

interface ScoreCardProps {
  scoreKey: keyof AnalysisScores;
  value: number;
  index: number;
}

const SCORE_CONFIG: Record<
  keyof AnalysisScores,
  {
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  feasibility: {
    label: '実現可能性',
    description: '技術的・リソース的に実現可能か',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  marketSize: {
    label: '市場規模',
    description: 'ターゲット市場の大きさと成長性',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  innovation: {
    label: '革新性',
    description: '既存ソリューションとの差別化',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  profitability: {
    label: '収益性',
    description: '収益モデルの持続可能性',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  scalability: {
    label: '成長性',
    description: 'スケールの可能性',
    icon: Rocket,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  teamFit: {
    label: 'チーム適合',
    description: 'チームの強みとの整合性',
    icon: Users,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
};

export function ScoreCard({ scoreKey, value, index }: ScoreCardProps) {
  const config = SCORE_CONFIG[scoreKey];
  const Icon = config.icon;

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: '優秀', color: 'text-green-600' };
    if (score >= 60) return { label: '良好', color: 'text-blue-600' };
    if (score >= 40) return { label: '要改善', color: 'text-amber-600' };
    return { label: '要検討', color: 'text-red-600' };
  };

  const level = getScoreLevel(value);

  return (
    <motion.div
      className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: index * 0.1,
      }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            config.bgColor
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className={cn('w-5 h-5', config.color)} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-slate-900 text-sm">
              {config.label}
            </h3>
            <span className={cn('text-xs font-medium', level.color)}>
              {level.label}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-2">{config.description}</p>

          {/* Progress bar */}
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={cn('absolute inset-y-0 left-0 rounded-full', {
                'bg-green-500': value >= 80,
                'bg-blue-500': value >= 60 && value < 80,
                'bg-amber-500': value >= 40 && value < 60,
                'bg-red-500': value < 40,
              })}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{
                duration: 1,
                delay: 0.5 + index * 0.1,
                ease: 'easeOut',
              }}
            />
          </div>

          <div className="flex justify-end mt-1">
            <motion.span
              className="text-lg font-bold text-slate-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              {value}
            </motion.span>
            <span className="text-sm text-slate-400 ml-0.5">/100</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
