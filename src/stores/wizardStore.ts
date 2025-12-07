import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIPersonality, ProjectAttributes } from '@/types';

interface WizardState {
  currentStep: number;
  data: Partial<ProjectAttributes & { aiPersonality: AIPersonality }>;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<ProjectAttributes & { aiPersonality: AIPersonality }>) => void;
  reset: () => void;
}

const initialData = {
  genre: '',
  businessModel: '',
  revenueGoal: '',
  startTiming: '',
  strengths: [] as string[],
  marketChallenges: '',
  decisionStyle: 'logic' as const,
  organizationType: '',
  aiPersonality: 'mentor' as AIPersonality,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      currentStep: 0,
      data: initialData,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 5),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      updateData: (data) =>
        set((state) => ({
          data: { ...state.data, ...data },
        })),

      reset: () =>
        set({
          currentStep: 0,
          data: initialData,
        }),
    }),
    {
      name: 'loopin-wizard',
    }
  )
);
