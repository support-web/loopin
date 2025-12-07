'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import type { PlanData, Project } from '@/types';

interface PlanFormProps {
  projectId: string;
  initialData?: PlanData | null;
  onUpdate?: (data: PlanData) => void;
}

const PLAN_FIELDS = [
  { key: 'serviceName', label: 'サービス名', placeholder: '例: Loopin' },
  {
    key: 'overview',
    label: 'サービス概要',
    placeholder: 'サービスの概要を入力',
    multiline: true,
  },
  {
    key: 'targetMarket',
    label: 'ターゲット市場',
    placeholder: '誰に提供するサービスか',
    multiline: true,
  },
  {
    key: 'valueProposition',
    label: '提供価値',
    placeholder: 'ユーザーが得られる価値',
    multiline: true,
  },
  {
    key: 'competitors',
    label: '競合・差別化',
    placeholder: '競合と差別化ポイント',
    multiline: true,
  },
  {
    key: 'revenueModel',
    label: '収益モデル',
    placeholder: 'どのように収益を得るか',
    multiline: true,
  },
  {
    key: 'milestones',
    label: 'マイルストーン',
    placeholder: '実現に向けたステップ',
    multiline: true,
  },
] as const;

export function PlanForm({ projectId, initialData, onUpdate }: PlanFormProps) {
  const [data, setData] = useState<PlanData>({
    serviceName: '',
    overview: '',
    targetMarket: '',
    valueProposition: '',
    competitors: '',
    revenueModel: '',
    milestones: '',
    ...initialData,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autofilledFields, setAutofilledFields] = useState<string[]>([]);

  const supabase = createClient();

  const handleAutofill = async () => {
    setIsLoading(true);
    setAutofilledFields([]);

    try {
      const response = await fetch('/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error('Autofill failed');
      }

      const result = await response.json();
      const newData = result.planData as PlanData;

      // Track which fields were filled
      const filled: string[] = [];
      Object.entries(newData).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.trim()) {
          filled.push(key);
        }
      });

      setData(newData);
      setAutofilledFields(filled);
      onUpdate?.(newData);
    } catch (error) {
      console.error('Autofill error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await supabase
        .from('projects')
        .update({
          plan_data: data,
          title: data.serviceName || 'New Project',
        })
        .eq('id', projectId);

      onUpdate?.(data);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: keyof PlanData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setAutofilledFields((prev) => prev.filter((k) => k !== key));
  };

  return (
    <Card variant="glass" className="h-full flex flex-col">
      <CardHeader className="border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">事業計画フォーム</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAutofill}
              isLoading={isLoading}
              leftIcon={<Wand2 className="w-4 h-4" />}
            >
              AI入力
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              保存
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {PLAN_FIELDS.map((field, index) => {
          const isAutofilled = autofilledFields.includes(field.key);

          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {field.label}
                {isAutofilled && (
                  <motion.span
                    className="ml-2 text-xs text-primary-500 font-normal"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    ✨ AI入力
                  </motion.span>
                )}
              </label>
              {field.multiline ? (
                <motion.textarea
                  value={data[field.key] || ''}
                  onChange={(e) =>
                    handleChange(field.key as keyof PlanData, e.target.value)
                  }
                  placeholder={field.placeholder}
                  rows={3}
                  className={`w-full px-3 py-2 bg-white/60 border rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none ${
                    isAutofilled ? 'border-primary-300 bg-primary-50/30' : 'border-slate-200'
                  }`}
                  animate={
                    isAutofilled
                      ? {
                          boxShadow: [
                            '0 0 0 0 rgba(12, 133, 241, 0)',
                            '0 0 0 4px rgba(12, 133, 241, 0.1)',
                            '0 0 0 0 rgba(12, 133, 241, 0)',
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.input
                  type="text"
                  value={data[field.key] || ''}
                  onChange={(e) =>
                    handleChange(field.key as keyof PlanData, e.target.value)
                  }
                  placeholder={field.placeholder}
                  className={`w-full px-3 py-2 bg-white/60 border rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${
                    isAutofilled ? 'border-primary-300 bg-primary-50/30' : 'border-slate-200'
                  }`}
                  animate={
                    isAutofilled
                      ? {
                          boxShadow: [
                            '0 0 0 0 rgba(12, 133, 241, 0)',
                            '0 0 0 4px rgba(12, 133, 241, 0.1)',
                            '0 0 0 0 rgba(12, 133, 241, 0)',
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
