import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-background">
      <div className="container grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-extrabold tracking-tight text-primary">
            <span className="inline-block h-6 w-6 rounded-[0.35rem] bg-gradient-to-br from-primary to-secondary" aria-hidden />
            ICAS
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            International Center for Applied Science. Advancing knowledge for global good.
          </p>
        </div>
        <nav className="grid gap-2 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Academics</div>
          <Link to="/academics" className="hover:text-primary">Programs</Link>
          <Link to="/faculty" className="hover:text-primary">Faculty</Link>
          <Link to="/events" className="hover:text-primary">Events</Link>
        </nav>
        <nav className="grid gap-2 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Research</div>
          <Link to="/research" className="hover:text-primary">Research & Medicine</Link>
          <Link to="/impact" className="hover:text-primary">Impact & Outreach</Link>
          <Link to="/news" className="hover:text-primary">News</Link>
        </nav>
        <nav className="grid gap-2 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admissions</div>
          <Link to="/admissions-aid" className="hover:text-primary">Admissions & Aid</Link>
          <Link to="/financial-aid" className="hover:text-primary">Financial Aid</Link>
          <Link to="/medical-aid" className="hover:text-primary">Medical Aid</Link>
          <Link to="/transfer" className="hover:text-primary">Transfer (2+2)</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </nav>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ICAS. All rights reserved.
      </div>
    </footer>
  );
}
