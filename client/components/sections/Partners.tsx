import { Link } from "react-router-dom";

/** A selection of the partner universities shown on the transfer map. */
const partners = [
  "Purdue University",
  "University of Illinois Urbana-Champaign",
  "University of Wisconsin-Madison",
  "Drexel University",
  "University of Arizona",
  "Iowa State University",
];

export default function Partners() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="border-y bg-muted/30"
    >
      <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:gap-8">
        <div className="shrink-0">
          <h2
            id="partners-heading"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            2+2 partner universities
          </h2>
          <Link to="/transfer" className="link text-sm">
            See all on the map
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2">
          {partners.map((name) => (
            <li
              key={name}
              className="rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-foreground/80"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
