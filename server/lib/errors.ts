/**
 * Error type for failures that are safe to surface to API clients.
 * Anything else is logged server-side and reported as a generic 5xx.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function toErrorResponse(err: unknown): {
  status: number;
  body: { error: string };
} {
  if (err instanceof HttpError) {
    return { status: err.status, body: { error: err.message } };
  }
  return { status: 500, body: { error: "Internal server error" } };
}
