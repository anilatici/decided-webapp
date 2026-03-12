'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAutopilotStore } from '@/lib/store/autopilotStore';

const steps = [
  {
    title: 'What time do you want to wrap up?',
    field: 'wrapUpTime',
    render: (value: string, setValue: (value: string) => void) => (
      <input
        className="w-full rounded-card border border-border bg-elevated px-4 py-3 text-text-primary"
        type="time"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    ),
  },
  {
    title: "How's your energy right now?",
    field: 'energyLevel',
    render: (value: number, setValue: (value: number) => void) => (
      <div className="space-y-4">
        <input
          className="w-full accent-accent"
          max={5}
          min={1}
          type="range"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
        <div className="flex justify-between text-sm text-text-secondary">
          <span>😴 Drained</span>
          <span>Wired ⚡</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Drop your top tasks for today',
    field: 'tasks',
    render: (value: string, setValue: (value: string) => void) => (
      <textarea
        className="min-h-40 w-full rounded-card border border-border bg-elevated px-4 py-3"
        placeholder={'Finish project proposal\nReply to emails'}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    ),
  },
  {
    title: 'Any hard commitments? (optional)',
    field: 'blockedTimes',
    render: (value: string, setValue: (value: string) => void) => (
      <textarea
        className="min-h-40 w-full rounded-card border border-border bg-elevated px-4 py-3"
        placeholder={'11:00 team standup\n14:30 dentist'}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    ),
  },
  {
    title: 'Your #1 priority. One thing.',
    field: 'topPriority',
    render: (value: string, setValue: (value: string) => void) => (
      <input
        className="w-full rounded-card border border-border bg-elevated px-4 py-3"
        placeholder="Ship the proposal"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    ),
  },
] as const;

export function SetupWizard({ onSubmit }: { onSubmit: () => void }) {
  const { step, form, nextStep, previousStep, setFormValue, isLoading } = useAutopilotStore();
  const current = steps[step];

  function renderField() {
    switch (current.field) {
      case 'wrapUpTime':
        return current.render(form.wrapUpTime, (value: string) => setFormValue('wrapUpTime', value));
      case 'energyLevel':
        return current.render(form.energyLevel, (value: number) => setFormValue('energyLevel', value));
      case 'tasks':
        return current.render(form.tasks, (value: string) => setFormValue('tasks', value));
      case 'blockedTimes':
        return current.render(form.blockedTimes, (value: string) => setFormValue('blockedTimes', value));
      case 'topPriority':
        return current.render(form.topPriority, (value: string) => setFormValue('topPriority', value));
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="h-2 rounded-full bg-elevated">
        <div className="h-full rounded-full bg-accent" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="space-y-5"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
        >
          <h1 className="font-display text-6xl uppercase leading-none">{current.title}</h1>
          {renderField()}
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-3">
        {step > 0 ? (
          <Button fullWidth type="button" variant="secondary" onClick={previousStep}>
            Back
          </Button>
        ) : null}
        <Button fullWidth disabled={isLoading} onClick={step === steps.length - 1 ? onSubmit : nextStep} type="button">
          {isLoading ? 'Building...' : step === steps.length - 1 ? 'Build My Day →' : 'Next →'}
        </Button>
      </div>
    </div>
  );
}
