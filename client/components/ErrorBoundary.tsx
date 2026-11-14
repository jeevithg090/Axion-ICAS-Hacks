import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  error: Error | null;
}

/** Catches render errors (including failed lazy chunk loads) and shows a recovery UI. */
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="container py-16" role="alert">
        <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page failed to load. This is often a dropped connection or a new
            version of the site. Reloading usually fixes it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Reload page
            </button>
            <a
              href="/"
              className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-semibold hover:bg-muted"
            >
              Go to home page
            </a>
          </div>
        </div>
      </main>
    );
  }
}
