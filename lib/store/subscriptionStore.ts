'use client';

import { create } from 'zustand';

const STORAGE_KEY = 'decided-daily-usage';

interface DailyUsage {
  date: string;
  count: number;
}

interface SubscriptionState {
  isPro: boolean;
  dailyCount: number;
  streak: number;
  feedbackCount: number;
  hydrate: () => void;
  setIsPro: (isPro: boolean) => void;
  incrementDailyCount: () => void;
  resetDailyCount: () => void;
  setStreak: (streak: number) => void;
  setFeedbackCount: (feedbackCount: number) => void;
}

function readUsage(): DailyUsage {
  if (typeof window === 'undefined') {
    return { date: '', count: 0 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: '', count: 0 };
    return JSON.parse(raw) as DailyUsage;
  } catch {
    return { date: '', count: 0 };
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isPro: false,
  dailyCount: 0,
  streak: 0,
  feedbackCount: 0,
  hydrate: () => {
    const usage = readUsage();
    if (usage.date === todayKey()) {
      set({ dailyCount: usage.count });
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), count: 0 }));
    set({ dailyCount: 0 });
  },
  setIsPro: (isPro) => set({ isPro }),
  incrementDailyCount: () => {
    const nextCount = get().dailyCount + 1;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), count: nextCount }));
    set({ dailyCount: nextCount });
  },
  resetDailyCount: () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), count: 0 }));
    set({ dailyCount: 0 });
  },
  setStreak: (streak) => set({ streak }),
  setFeedbackCount: (feedbackCount) => set({ feedbackCount }),
}));
