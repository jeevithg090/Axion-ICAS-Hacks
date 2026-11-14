export default function AuthLoading() {
  return (
    <main className="container py-16" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-md space-y-3 animate-pulse">
        <div className="h-6 w-1/2 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <span className="sr-only">Loading your session…</span>
      </div>
    </main>
  );
}
