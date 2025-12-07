'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BUSINESS_MODEL_OPTIONS } from '@/types';
import { useWizardStore } from '@/stores/wizardStore';
import {
  RefreshCw,
  Store,
  Package,
  Gift,
  Megaphone,
  Percent,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  subscription: RefreshCw,
  marketplace: Store,
  onetime: Package,
  freemium: Gift,
  advertising: Megaphone,
  commission: Percent,
};

const descriptionMap: Record<string, string> = {
  subscription: '月額・年額の定期課金でサービスを提供',
  marketplace: '売り手と買い手をつなぐプラットフォーム',
  onetime: '製品やサービスを一度きりの支払いで提供',
  freemium: '基本無料で、追加機能を有料で提供',
  advertising: '広告収入で無料サービスを運営',
  commission: '取引額の一部を手数料として徴収',
};

export function ModelStep() {
  const { data, updateData } = useWizardStore();

  const handleSelect = (value: string) => {
    updateData({ businessModel: value });
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
          ビジネスモデルを選択
        </h2>
        <p className="text-slate-600">どのように収益を得る予定ですか？</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {BUSINESS_MODEL_OPTIONS.map((option, index) => {
          const Icon = iconMap[option.value] || Package;
          const isSelected = data.businessModel === option.value;
          const description = descriptionMap[option.value];

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
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.08,
              }}
              whileHover={{
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 10 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-primary-500' : 'bg-slate-100'
                  )}
                  animate={{
                    scale: isSelected ? [1, 1.1, 1] : 1,
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
                <div>
                  <p
                    className={cn(
                      'font-semibold mb-1',
                      isSelected ? 'text-primary-700' : 'text-slate-700'
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-sm text-slate-500">{description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
