import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function Placeholder({ title }: { title: string }) {
  return (
    <main className="container py-16">
      <SEO title={`${title} — ICAS`} description={`${title} page for ICAS.`} />
      <div className="mx-auto max-w-2xl rounded-2xl bg-card p-8 text-center shadow-soft ring-1 ring-border">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">
          This page is ready to be authored. Tell me to generate its full contents next.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
