export type Submission = { assignmentId: string; url?: string; notes?: string; submittedAt: string };
const KEY = "icas_submissions";

export function getSubmissions(): Record<string, Submission> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSubmission(s: Submission) {
  const all = getSubmissions();
  all[s.assignmentId] = s;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getSubmission(id: string): Submission | undefined {
  return getSubmissions()[id];
}
