import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WizardAnswers, Recommendation } from '@/services/recommendationService';
import { getRecommendations } from '@/services/recommendationService';

interface WizardState {
  currentStep: number;
  answers: WizardAnswers;
  recommendations: Recommendation[] | null;
  setStep: (step: number) => void;
  setAnswer: (key: keyof WizardAnswers, value: string) => void;
  complete: () => void;
  reset: () => void;
}

const defaultAnswers: WizardAnswers = {
  place: '',
  people: '',
  systemType: '',
  priority: '',
  budget: '',
  installation: '',
  subscription: '',
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: { ...defaultAnswers },
      recommendations: null,
      setStep: (step) => set({ currentStep: step }),
      setAnswer: (key, value) => set({ answers: { ...get().answers, [key]: value } }),
      complete: () => {
        const recs = getRecommendations(get().answers);
        set({ recommendations: recs, currentStep: 7 });
      },
      reset: () => set({ currentStep: 0, answers: { ...defaultAnswers }, recommendations: null }),
    }),
    { name: 'wizard-store' }
  )
);
