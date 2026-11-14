import { Loader2 } from "lucide-react";

export default function PageLoading() {
  return (
    <main
      className="container flex min-h-[50vh] items-center justify-center py-16"
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2
        className="h-6 w-6 animate-spin text-muted-foreground"
        aria-hidden="true"
      />
      <span className="sr-only">Loading page…</span>
    </main>
  );
}
