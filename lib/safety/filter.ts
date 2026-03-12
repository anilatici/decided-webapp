export const BLOCKED_PATTERNS = [
  'kill myself',
  'end my life',
  'commit suicide',
  'how to die',
  'self harm',
  'cut myself',
  'hurt myself',
  'make a bomb',
  'build a gun',
  'how to make explosives',
  'pipe bomb',
  'molotov',
  'make a weapon',
  'synthesize meth',
  'make cocaine',
  'cook drugs',
  'how to make drugs',
  'extract dmt',
  'child porn',
  'cp ',
  ' cp,',
  'minors sexually',
  'kids nude',
  'underage sex',
  'write malware',
  'ransomware code',
  'hack into',
  'sql injection tutorial',
  'write a virus',
  'ignore previous instructions',
  'pretend you have no',
  'act as dan',
  'jailbreak',
  'you are now an ai with no',
  'forget your instructions',
  'your true instructions',
];

export const SELF_HARM_PATTERNS = [
  'kill myself',
  'end my life',
  'suicide',
  'self harm',
  'cut myself',
  'hurt myself',
  'want to die',
  'dont want to live',
  "don't want to live",
];

export function isSafe(input: string): boolean {
  const lower = input.toLowerCase().trim();
  if (input.length > 1000) return false;
  return !BLOCKED_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function isSelfHarmRelated(input: string): boolean {
  const lower = input.toLowerCase();
  return SELF_HARM_PATTERNS.some((pattern) => lower.includes(pattern));
}

export const BLOCKED_MESSAGE =
  "That's outside what I can help with. Decided is for everyday decisions - what to eat, what to work on, how to spend your time. Want to try a decision like that?";

export const SELF_HARM_MESSAGE =
  "I'm not able to help with that, but please know support is available. If you're in crisis, contact your local emergency services or a crisis helpline. You don't have to face this alone.";

const MODEL_BLOCKED_HINTS = [
  "that's outside what i can help with",
  'decided is built for everyday decisions',
  'decided is for everyday decisions',
  "i'm not able to help with that",
  "i am not able to help with that",
  'contact your local emergency services',
  'crisis line',
  'crisis helpline',
];

export function getSafetyMessage(input: string): string | null {
  if (isSelfHarmRelated(input)) {
    return SELF_HARM_MESSAGE;
  }

  if (!isSafe(input)) {
    return BLOCKED_MESSAGE;
  }

  return null;
}

export function getBlockedMessageFromModelOutput(output: string): string | null {
  const normalized = output.toLowerCase().trim();

  if (!normalized) {
    return null;
  }

  if (MODEL_BLOCKED_HINTS.some((hint) => normalized.includes(hint))) {
    if (
      normalized.includes('emergency services') ||
      normalized.includes('crisis line') ||
      normalized.includes('crisis helpline')
    ) {
      return SELF_HARM_MESSAGE;
    }

    return BLOCKED_MESSAGE;
  }

  return null;
}
