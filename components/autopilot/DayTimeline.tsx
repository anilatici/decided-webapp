import { Card } from '@/components/ui/Card';
import { UpgradeNudge } from '@/components/paywall/UpgradeNudge';
import type { ScheduledTask } from '@/types';

export function DayTimeline({
  tasks,
  isPro,
  onUpgrade,
}: {
  tasks: ScheduledTask[];
  isPro: boolean;
  onUpgrade: () => void;
}) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const locked = !isPro && index >= 3;
        if (locked && index === 3) {
          return (
            <div key={task.id} className="space-y-3">
              <UpgradeNudge
                title="The rest of your day is locked."
                body="Upgrade to unlock the full schedule and task sequencing."
                onUpgrade={onUpgrade}
              />
              <Card className="opacity-50 blur-[1px]">
                <div className="font-medium">{task.title}</div>
                <div className="mt-1 text-sm text-text-secondary">
                  {task.startTime} - {task.endTime}
                </div>
              </Card>
            </div>
          );
        }

        if (locked) {
          return null;
        }

        return (
          <Card key={task.id}>
            <div className="font-medium text-text-primary">{task.title}</div>
            <div className="mt-1 text-sm text-text-secondary">
              {task.startTime} - {task.endTime}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
