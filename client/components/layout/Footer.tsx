import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { contacts } from "@/data/sample";
import Logo from "./Logo";

const columns = [
  {
    title: "Academics",
    links: [
      { to: "/academics", label: "Programs" },
      { to: "/faculty", label: "Faculty" },
      { to: "/events", label: "Events" },
      { to: "/transfer", label: "Transfer (2+2)" },
    ],
  },
  {
    title: "Research",
    links: [
      { to: "/research", label: "Research & Medicine" },
      { to: "/impact", label: "Impact & Outreach" },
      { to: "/news", label: "News" },
    ],
  },
  {
    title: "Students",
    links: [
      { to: "/admissions-aid", label: "Admissions & Aid" },
      { to: "/financial-aid", label: "Financial Aid" },
      { to: "/medical-aid", label: "Medical Aid" },
      { to: "/portal", label: "Student Portal" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-muted/30">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            International Center for Applied Science. A student life assistant
            for the 2+2 transfer pathway, built by Team AXION.
          </p>
          <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{contacts.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${contacts.email}`}
                className="hover:text-foreground"
              >
                {contacts.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a
                href={`tel:${contacts.phone}`}
                className="hover:text-foreground"
              >
                {contacts.phone}
              </a>
            </li>
          </ul>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {c.title}
            </h2>
            <ul className="mt-3 grid gap-1">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="inline-block rounded py-1 text-foreground/80 hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ICAS · Team AXION, Enigma Hackathon
            2025.
          </p>
          <Link to="/contact" className="hover:text-foreground">
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
}
