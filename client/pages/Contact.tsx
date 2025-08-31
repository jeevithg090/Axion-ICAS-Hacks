import SEO from "@/components/SEO";
import { contacts } from "@/data/sample";

export default function Contact() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    console.log(Object.fromEntries(data.entries()));
    alert("Thanks! We received your message (sample). You can wire this up later.");
  };
  return (
    <main>
      <SEO title="Contact — ICAS" description="Reach the ICAS team." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-card p-6 ring-1 ring-border">
            <label className="grid text-sm">
              <span>Name</span>
              <input name="name" required className="mt-1 rounded-md border bg-background px-3 py-2" />
            </label>
            <label className="grid text-sm">
              <span>Email</span>
              <input type="email" name="email" required className="mt-1 rounded-md border bg-background px-3 py-2" />
            </label>
            <label className="grid text-sm">
              <span>Message</span>
              <textarea name="message" rows={5} required className="mt-1 rounded-md border bg-background px-3 py-2" />
            </label>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Send</button>
          </form>
          <div className="rounded-xl bg-card p-6 ring-1 ring-border">
            <div className="font-semibold">Address</div>
            <div className="text-sm text-muted-foreground">{contacts.address}</div>
            <div className="mt-3 font-semibold">Email</div>
            <a className="text-sm text-primary underline-offset-4 hover:underline" href={`mailto:${contacts.email}`}>{contacts.email}</a>
            <div className="mt-3 font-semibold">Phone</div>
            <a className="text-sm text-primary" href={`tel:${contacts.phone}`}>{contacts.phone}</a>
            <div className="mt-3">
              <a className="text-sm text-primary underline-offset-4 hover:underline" href={contacts.map} target="_blank" rel="noreferrer">Open map</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
