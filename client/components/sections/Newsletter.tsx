export default function Newsletter() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    alert(`Subscribed: ${data.get('email')}`);
  };
  return (
    <section className="relative isolate">
      <div className="container py-14">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 ring-1 ring-border">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight">Stay in the loop</h2>
            <p className="mt-2 text-sm text-muted-foreground">Get news, events, and research updates in your inbox.</p>
            <form onSubmit={onSubmit} className="mt-5 flex gap-2 max-sm:flex-col">
              <input required type="email" name="email" placeholder="you@example.com" className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
