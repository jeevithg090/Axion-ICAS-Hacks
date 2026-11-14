import { Megaphone, Users, BookOpen, type LucideIcon } from "lucide-react";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";

const areas: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "University Announcements",
    body: "Post campus-wide updates and alerts.",
    icon: Megaphone,
  },
  {
    title: "Courses & Faculty",
    body: "Create and update course listings, assign faculty.",
    icon: BookOpen,
  },
  {
    title: "Student Records",
    body: "View student profiles and academic progress.",
    icon: Users,
  },
];

export default function Admin() {
  return (
    <main>
      <SEO
        title="Admin Dashboard — ICAS"
        description="University administrator console"
      />
      <section className="container py-10">
        <PageHeader
          eyebrow="Administrator"
          title="Administrator Dashboard"
          description="Manage announcements, courses, and student data."
        />

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {areas.map((a) => (
            <li key={a.title} className="surface p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <a.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Coming soon
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold">{a.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
