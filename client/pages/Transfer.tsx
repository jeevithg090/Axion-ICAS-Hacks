import SEO from "@/components/SEO";
import { transferUniversities } from "@/data/sample";
import UniversityMap from "@/components/UniversityMap";

export default function Transfer() {
  const groups = Object.entries(transferUniversities);
  return (
    <main>
      <SEO title="Transfer — 2+2 Pathway" description="Transfer from ICAS (MAHE) to international partner universities for years 3–4." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Transfer (2+2 Pathway)</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Study 2 years at MAHE (Manipal) and 2 years abroad at a partner university. Credits are mapped with advising support.</p>
        
        {/* Interactive Map */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Partner Universities Worldwide</h2>
          <UniversityMap />
        </div>

        {/* University List */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Complete University List</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {groups.map(([country, list]) => (
              <div key={country}>
                <h3 className="text-lg font-semibold mb-3 text-primary">{country}</h3>
                <ul className="space-y-2 text-sm">
                  {list.map((u) => (
                    <li key={u.name} className="rounded-md bg-card p-3 ring-1 ring-border transition hover:bg-muted/50">
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {u.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
