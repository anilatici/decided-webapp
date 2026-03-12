'use client';

export function QuestionBoolean({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {['Yes', 'No'].map((item) => (
        <button
          key={item}
          className={`rounded-card border px-5 py-4 ${
            value === item
              ? 'border-accent bg-accent/5 text-text-primary'
              : 'border-border bg-elevated text-text-secondary'
          }`}
          onClick={() => onChange(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
