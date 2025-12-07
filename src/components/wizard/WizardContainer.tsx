'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from './StepIndicator';
import { GenreStep } from './steps/GenreStep';
import { ModelStep } from './steps/ModelStep';
import { GoalStep } from './steps/GoalStep';
import { StrengthsStep } from './steps/StrengthsStep';
import { PartnerStep } from './steps/PartnerStep';
import { useWizardStore } from '@/stores/wizardStore';
import { createClient } from '@/lib/supabase/client';
import { WIZARD_STEPS } from '@/types';

const steps = [GenreStep, ModelStep, GoalStep, GoalStep, StrengthsStep, PartnerStep];

export function WizardContainer() {
  const router = useRouter();
  const supabase = createClient();
  const [isCreating, setIsCreating] = useState(false);
  const { currentStep, nextStep, prevStep, data, reset } = useWizardStore();

  const StepComponent = steps[currentStep];
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!data.genre;
      case 1:
        return !!data.businessModel;
      case 2:
        return !!data.revenueGoal;
      case 3:
        return !!data.startTiming;
      case 4:
        return data.strengths && data.strengths.length > 0;
      case 5:
        return !!data.aiPersonality;
      default:
        return false;
    }
  };

  const handleCreateProject = async () => {
    setIsCreating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push('/login');
        return;
      }

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: userData.user.id,
          title: '新しいプロジェクト',
          attributes: {
            genre: data.genre,
            businessModel: data.businessModel,
            revenueGoal: data.revenueGoal,
            startTiming: data.startTiming,
            strengths: data.strengths,
            marketChallenges: data.marketChallenges || '',
            decisionStyle: data.decisionStyle || 'logic',
            organizationType: data.organizationType || '',
          },
          ai_personality: data.aiPersonality || 'mentor',
        })
        .select()
        .single();

      if (error) throw error;

      reset();
      router.push(`/project/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            新しい構想を始めよう
          </h1>
          <p className="text-slate-600">
            いくつかの質問に答えて、AIパートナーとの壁打ちを始めましょう
          </p>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={isFirstStep}
            leftIcon={<ChevronLeft className="w-5 h-5" />}
          >
            戻る
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleCreateProject}
              isLoading={isCreating}
              disabled={!canProceed()}
              rightIcon={<Rocket className="w-5 h-5" />}
            >
              壁打ちを始める
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              rightIcon={<ChevronRight className="w-5 h-5" />}
            >
              次へ
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
