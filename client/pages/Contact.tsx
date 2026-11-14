import { useState } from "react";
import { CheckCircle2, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import FieldError from "@/components/FieldError";
import { contacts } from "@/data/sample";
import {
  email,
  minLength,
  required,
  useSimpleForm,
} from "@/hooks/use-simple-form";

const rules = {
  name: [required("name")],
  email: [email],
  message: [required("message"), minLength(10, "message")],
};

export default function Contact() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { errors, onSubmit, onChange, field } = useSimpleForm(
    rules,
    (values, form) => {
      // There is no messaging backend yet; confirm locally.
      setSentTo(values.name.trim());
      form.reset();
    },
  );

  return (
    <main>
      <SEO title="Contact — ICAS" description="Reach the ICAS team." />
      <section className="container py-12">
        <PageHeader
          eyebrow="Get in touch"
          title="Contact"
          description="Questions about admissions, the 2+2 pathway or the portal? Send us a message."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="surface p-6 sm:p-8 lg:col-span-3">
            {sentTo ? (
              <div role="status" className="py-6 text-center">
                <CheckCircle2
                  className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <h2 className="mt-4 text-xl font-semibold">
                  Thanks, {sentTo}!
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Your message is ready. This demo has no mail server yet, so
                  for anything urgent email{" "}
                  <a className="link" href={`mailto:${contacts.email}`}>
                    {contacts.email}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSentTo(null)}
                  className="mt-6 inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={onSubmit}
                onChange={onChange}
                className="space-y-5"
              >
                <h2 className="text-lg font-semibold">Send a message</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="text-sm font-medium"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      autoComplete="name"
                      className="field mt-1.5 h-11"
                      {...field("name")}
                    />
                    <FieldError id="name-error" message={errors.name} />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      className="field mt-1.5 h-11"
                      {...field("email")}
                    />
                    <FieldError id="email-error" message={errors.email} />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className="field mt-1.5 resize-y"
                    {...field("message")}
                  />
                  <FieldError id="message-error" message={errors.message} />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          <aside className="surface p-6 sm:p-8 lg:col-span-2">
            <h2 className="text-lg font-semibold">Reach us directly</h2>
            <dl className="mt-5 grid gap-5 text-sm">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-medium">Address</dt>
                  <dd className="text-muted-foreground">{contacts.address}</dd>
                  <dd>
                    <a
                      className="link inline-flex items-center gap-1"
                      href={contacts.map}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open map
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-medium">Email</dt>
                  <dd>
                    <a className="link" href={`mailto:${contacts.email}`}>
                      {contacts.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-medium">Phone</dt>
                  <dd>
                    <a className="link" href={`tel:${contacts.phone}`}>
                      {contacts.phone}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}
