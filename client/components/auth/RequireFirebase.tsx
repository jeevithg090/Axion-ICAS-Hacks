import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { DatabaseZap } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { isFirebaseConfigured } from "@/lib/firebase";

/**
 * Guards features that need Firebase (Firestore/Storage). In demo mode it shows
 * setup instructions instead of letting the page fail on a missing backend.
 */
export default function RequireFirebase({
  feature,
  children,
}: {
  feature: string;
  children: ReactElement;
}) {
  if (isFirebaseConfigured) return children;
  return (
    <main className="container py-16">
      <SEO
        title={`${feature} — setup required`}
        description={`${feature} requires a Firebase backend.`}
      />
      <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center shadow-sm">
        <DatabaseZap
          className="mx-auto h-10 w-10 text-primary"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-xl font-semibold">{feature} needs Firebase</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This feature stores data in Cloud Firestore and Firebase Storage. Add
          your Firebase web app credentials (the <code>VITE_FIREBASE_*</code>{" "}
          variables in <code>.env.example</code>) and rebuild to enable it.
        </p>
        <Button asChild className="mt-6">
          <Link to="/portal">Back to portal</Link>
        </Button>
      </div>
    </main>
  );
}
