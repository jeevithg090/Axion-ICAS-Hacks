import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import FieldError from "@/components/FieldError";
import { email, useSimpleForm } from "@/hooks/use-simple-form";

export default function Newsletter() {
  const [done, setDone] = useState(false);
  const { errors, onSubmit, onChange, field } = useSimpleForm(
    { email: [email] },
    (_values, form) => {
      // No mailing-list backend yet; confirm locally.
      setDone(true);
      form.reset();
    },
  );

  return (
    <section aria-labelledby="newsletter-heading" className="relative isolate">
      <div className="container py-14">
        <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 to-secondary/10 p-6 sm:p-10">
          <div className="max-w-2xl">
            <h2
              id="newsletter-heading"
              className="text-2xl font-bold tracking-tight"
            >
              Stay in the loop
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Get news, events, and research updates in your inbox.
            </p>
            {done ? (
              <p
                role="status"
                className="mt-5 flex items-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                You’re on the list. (Demo only: no emails are sent yet.)
              </p>
            ) : (
              <form
                noValidate
                onSubmit={onSubmit}
                onChange={onChange}
                className="mt-5"
              >
                <div className="flex gap-2 max-sm:flex-col">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    className="field h-11 flex-1"
                    {...field("email")}
                  />
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Subscribe
                  </button>
                </div>
                <FieldError id="email-error" message={errors.email} />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
