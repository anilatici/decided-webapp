export type FeedbackType = 'liked' | 'disliked' | 'none';

export interface Decision {
  id: string;
  user_id: string;
  input_text: string;
  category: string;
  headline: string;
  recommendation: string;
  reasoning: string;
  next_step: string;
  confidence: number;
  decision_label: string;
  feedback: FeedbackType;
  feedback_context: string | null;
  seconds_to_decide: number;
  created_at: string;
}

export interface ClarifyingQuestion {
  id: string;
  text: string;
  type: 'options' | 'scale' | 'boolean';
  options?: string[];
  scaleMin?: string;
  scaleMax?: string;
  answer?: string;
}

export interface Recommendation {
  headline: string;
  recommendation: string;
  reasoning: string;
  nextStep: string;
  confidence: number;
  decisionLabel: string;
}

export interface ScheduledTask {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  type: 'deep_work' | 'admin' | 'meeting' | 'break' | 'physical';
  energyRequired: 'high' | 'medium' | 'low';
  firstAction: string;
  completed: boolean;
}

export interface AutopilotSession {
  greeting: string;
  dailyTheme: string;
  schedule: ScheduledTask[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  stripe_customer_id: string | null;
  preference_profile?: string | null;
  created_at: string;
}

export type PaywallTrigger =
  | 'decision_limit'
  | 'autopilot_limit'
  | 'feedback_gate'
  | 'history_gate'
  | 'manual_upgrade';

export type DecideStep = 'input' | 'clarifying' | 'loading' | 'result' | 'blocked';
