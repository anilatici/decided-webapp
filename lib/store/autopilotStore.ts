'use client';

import { create } from 'zustand';
import type { AutopilotSession } from '@/types';

interface SetupForm {
  wrapUpTime: string;
  energyLevel: number;
  tasks: string;
  blockedTimes: string;
  topPriority: string;
}

interface AutopilotState {
  step: number;
  form: SetupForm;
  session: AutopilotSession | null;
  isLoading: boolean;
  setFormValue: <K extends keyof SetupForm>(key: K, value: SetupForm[K]) => void;
  nextStep: () => void;
  previousStep: () => void;
  setSession: (session: AutopilotSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

const initialForm: SetupForm = {
  wrapUpTime: '17:00',
  energyLevel: 3,
  tasks: '',
  blockedTimes: '',
  topPriority: '',
};

export const useAutopilotStore = create<AutopilotState>((set) => ({
  step: 0,
  form: initialForm,
  session: null,
  isLoading: false,
  setFormValue: (key, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [key]: value,
      },
    })),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  previousStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ step: 0, form: initialForm, session: null, isLoading: false }),
}));
