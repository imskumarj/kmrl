import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-3">{description}</p>
        </div>
        <div className="mt-8 grid gap-4">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              This page is part of the full Cloud Metro Smart Document Intelligence Platform. If you'd like, I can now flesh out this page with production-ready UI and interactions.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild><Link to="/upload">Go to Upload</Link></Button>
            <Button asChild variant="outline"><Link to="/">Back to Home</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
