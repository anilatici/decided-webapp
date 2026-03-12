'use client';

import { Button } from '@/components/ui/Button';

export function FeedbackBar({
  onFeedback,
}: {
  onFeedback: (type: 'liked' | 'disliked') => void;
}) {
  return (
    <div className="flex gap-3">
      <Button variant="secondary" onClick={() => onFeedback('liked')} type="button">
        👍 Liked
      </Button>
      <Button variant="secondary" onClick={() => onFeedback('disliked')} type="button">
        👎 Disliked
      </Button>
    </div>
  );
}
