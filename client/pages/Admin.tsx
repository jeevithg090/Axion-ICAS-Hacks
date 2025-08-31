import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Admin() {
  return (
    <main>
      <SEO title="Admin Dashboard — ICAS" description="University administrator console" />
      <section className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight">Administrator Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage announcements, courses, and student data.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">University Announcements</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Post campus-wide updates and alerts.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Courses & Faculty</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Create and update course listings, assign faculty.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Records</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              View student profiles and academic progress.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
