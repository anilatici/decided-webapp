function extractJsonBlock(value: string): string {
  const clean = value.replace(/```json|```/gi, '').trim();

  try {
    JSON.parse(clean);
    return clean;
  } catch {
    // Fall through to block extraction.
  }

  const start = clean.search(/[\[{]/);
  if (start === -1) {
    throw new Error('No JSON start token found');
  }

  const opening = clean[start];
  const closing = opening === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < clean.length; index += 1) {
    const char = clean[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === opening) {
      depth += 1;
      continue;
    }

    if (char === closing) {
      depth -= 1;
      if (depth === 0) {
        return clean.slice(start, index + 1);
      }
    }
  }

  throw new Error('No complete JSON block found');
}

export function parseJsonContent<T>(value: string): T {
  return JSON.parse(extractJsonBlock(value)) as T;
}
