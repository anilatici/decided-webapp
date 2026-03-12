'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SetupWizard } from '@/components/autopilot/SetupWizard';
import { ActiveTask } from '@/components/autopilot/ActiveTask';
import { DayTimeline } from '@/components/autopilot/DayTimeline';
import { PaywallModal } from '@/components/paywall/PaywallModal';
import { useAutopilotStore } from '@/lib/store/autopilotStore';
import { useSubscriptionStore } from '@/lib/store/subscriptionStore';
import type { UserProfile } from '@/types';

export function AutopilotClient({ profile }: { profile: UserProfile }) {
  const { session, setSession, setLoading, isLoading, form } = useAutopilotStore();
  const { isPro, setIsPro } = useSubscriptionStore();
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    setIsPro(profile.is_premium);
  }, [profile.is_premium, setIsPro]);

  async function handleBuild() {
    setLoading(true);
    try {
      const response = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          currentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Failed to build day');
      setSession({ ...data, createdAt: new Date().toISOString() });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to build day');
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return <SetupWizard onSubmit={() => void handleBuild()} />;
  }

  const activeTask = session.schedule.find((task) => !task.completed) ?? session.schedule[0];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="font-display text-5xl uppercase leading-none">{session.dailyTheme}</div>
        <div className="h-2 rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-accent"
            style={{
              width: `${(session.schedule.filter((task) => task.completed).length / session.schedule.length) * 100}%`,
            }}
          />
        </div>
      </div>
      <ActiveTask
        task={activeTask}
        onDelay={() => toast('Added 15 minutes')}
        onDone={() => {
          setSession({
            ...session,
            schedule: session.schedule.map((task) =>
              task.id === activeTask.id ? { ...task, completed: true } : task,
            ),
          });
        }}
      />
      <div className="space-y-4">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Coming Up</div>
        <DayTimeline tasks={session.schedule.slice(1, 6)} isPro={isPro} onUpgrade={() => setShowPaywall(true)} />
      </div>
      <PaywallModal open={showPaywall} trigger="autopilot_limit" onClose={() => setShowPaywall(false)} />
    </div>
  );
}
