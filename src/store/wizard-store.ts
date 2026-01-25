// store/wizard-store.ts
// TratoDatos - Zustand Store para el Wizard

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Step01Data,
  Step02Data,
  Step03Data,
  Step04Data,
  Step05Data,
  Step06Data,
  Step07Data,
  Step08Data,
  Step09Data,
  Step10Data,
  Step11Data,
  Step12Data,
} from '@/types/policy';

interface WizardData {
  step01: Step01Data | null;
  step02: Step02Data | null;
  step03: Step03Data | null;
  step04: Step04Data | null;
  step05: Step05Data | null;
  step06: Step06Data | null;
  step07: Step07Data | null;
  step08: Step08Data | null;
  step09: Step09Data | null;
  step10: Step10Data | null;
  step11: Step11Data | null;
  step12: Step12Data | null;
}

interface WizardState {
  policyId: string | null;
  policyName: string;
  currentStep: number;
  completedSteps: number[];
  data: WizardData;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Actions
  setPolicyId: (id: string) => void;
  setPolicyName: (name: string) => void;
  setCurrentStep: (step: number) => void;
  setStepData: <K extends keyof WizardData>(step: K, data: WizardData[K]) => void;
  markStepCompleted: (step: number) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  getCompletionPercentage: () => number;
  canAccessStep: (step: number) => boolean;
  resetWizard: () => void;
  loadPolicy: (policy: {
    id: string;
    name: string;
    currentStep: number;
    completedSteps: number[];
    step01Data: Step01Data | null;
    step02Data: Step02Data | null;
    step03Data: Step03Data | null;
    step04Data: Step04Data | null;
    step05Data: Step05Data | null;
    step06Data: Step06Data | null;
    step07Data: Step07Data | null;
    step08Data: Step08Data | null;
    step09Data: Step09Data | null;
    step10Data: Step10Data | null;
    step11Data: Step11Data | null;
    step12Data: Step12Data | null;
  }) => void;
}

const initialData: WizardData = {
  step01: null,
  step02: null,
  step03: null,
  step04: null,
  step05: null,
  step06: null,
  step07: null,
  step08: null,
  step09: null,
  step10: null,
  step11: null,
  step12: null,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      policyId: null,
      policyName: 'Nueva Política',
      currentStep: 1,
      completedSteps: [],
      data: initialData,
      isSaving: false,
      lastSaved: null,

      setPolicyId: (id) => set({ policyId: id }),
      
      setPolicyName: (name) => set({ policyName: name }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setStepData: (step, data) => set((state) => ({
        data: { ...state.data, [step]: data }
      })),
      
      markStepCompleted: (step) => set((state) => ({
        completedSteps: state.completedSteps.includes(step)
          ? state.completedSteps
          : [...state.completedSteps, step].sort((a, b) => a - b)
      })),
      
      setIsSaving: (saving) => set({ isSaving: saving }),
      
      setLastSaved: (date) => set({ lastSaved: date }),
      
      getCompletionPercentage: () => {
        const { completedSteps } = get();
        return Math.round((completedSteps.length / 12) * 100);
      },
      
      canAccessStep: (step) => {
        const { completedSteps } = get();
        // Can access step 1 always, or any step if previous is completed
        if (step === 1) return true;
        return completedSteps.includes(step - 1) || completedSteps.includes(step);
      },
      
      resetWizard: () => set({
        policyId: null,
        policyName: 'Nueva Política',
        currentStep: 1,
        completedSteps: [],
        data: initialData,
        isSaving: false,
        lastSaved: null,
      }),
      
      loadPolicy: (policy) => set({
        policyId: policy.id,
        policyName: policy.name,
        currentStep: policy.currentStep,
        completedSteps: policy.completedSteps,
        data: {
          step01: policy.step01Data,
          step02: policy.step02Data,
          step03: policy.step03Data,
          step04: policy.step04Data,
          step05: policy.step05Data,
          step06: policy.step06Data,
          step07: policy.step07Data,
          step08: policy.step08Data,
          step09: policy.step09Data,
          step10: policy.step10Data,
          step11: policy.step11Data,
          step12: policy.step12Data,
        },
      }),
    }),
    {
      name: 'tratodatos-wizard',
      partialize: (state) => ({
        policyId: state.policyId,
        policyName: state.policyName,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        data: state.data,
      }),
    }
  )
);
