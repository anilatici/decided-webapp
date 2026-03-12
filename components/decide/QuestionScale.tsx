'use client';

export function QuestionScale({
  minLabel,
  maxLabel,
  value,
  onChange,
}: {
  minLabel?: string;
  maxLabel?: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  const numericValue = Number(value ?? '3');

  return (
    <div className="space-y-4">
      <input
        className="w-full accent-accent"
        max={5}
        min={1}
        step={1}
        type="range"
        value={numericValue}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex justify-between font-mono text-xs text-text-secondary">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
