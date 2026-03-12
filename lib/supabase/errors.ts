type SupabaseLikeError = {
  code?: string | null;
  message?: string | null;
};

export function isMissingDecisionsTableError(error: SupabaseLikeError | null | undefined): boolean {
  const code = error?.code ?? '';
  const message = error?.message?.toLowerCase() ?? '';

  return (
    code === 'PGRST205' ||
    message.includes("could not find the table 'public.decisions'") ||
    message.includes('relation "public.decisions" does not exist') ||
    message.includes('relation "decisions" does not exist')
  );
}

export function getDecisionStorageErrorMessage(error: SupabaseLikeError | null | undefined): string {
  if (isMissingDecisionsTableError(error)) {
    return 'Decision history is not set up yet. Run the SQL setup for the decisions table and try again.';
  }

  return 'Unable to save this decision right now. Please try again.';
}
