/**
 * Types shared between the React client and the Express API.
 */

/** Error payload returned by every API endpoint on failure. */
export interface ApiError {
  error: string;
}

/** GET /api/ping */
export interface PingResponse {
  message: string;
}

/** POST /api/transfer/assistant request body */
export interface TransferAssistantRequest {
  question: string;
  context?: unknown;
}

/** POST /api/transfer/assistant */
export interface TransferAssistantResponse {
  answer: string;
}

export interface MeetingActionItem {
  owner: string;
  task: string;
  due_date?: string;
}

export interface MeetingTimelineEntry {
  timestamp?: string;
  note: string;
}

export interface MeetingSummary {
  title?: string;
  summary: string;
  attendees?: string[];
  agenda?: string[];
  decisions?: string[];
  action_items?: MeetingActionItem[];
  risks?: string[];
  next_steps?: string[];
  timeline?: MeetingTimelineEntry[];
}

/** POST /api/delegate/summary */
export interface DelegateSummaryResponse {
  transcript: string;
  /** Structured summary, or the raw model output when it was not valid JSON. */
  summary: MeetingSummary | string;
  modelUsed?: string;
}
