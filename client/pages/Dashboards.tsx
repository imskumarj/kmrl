import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const roles = ["Engineer","Procurement","HR","Finance","Executive"] as const;

type Doc = { _id: string; title: string; department: string; urgency: string; summary?: { short?: string } };

export default function Dashboards() {
  const [role, setRole] = useState<(typeof roles)[number]>("Engineer");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch<{ docs: Doc[] }>(`/api/documents?department=${encodeURIComponent(role)}`);
      setDocs(res.docs);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [role]);

  return (
    <section className="py-10">
      <div className="container px-4">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Dashboards</h1>
          <select className="h-9 rounded-md border bg-background px-3 text-sm" value={role} onChange={(e)=>setRole(e.target.value as any)}>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <Button variant="outline" onClick={load} disabled={loading}>{loading?"Refreshing...":"Refresh"}</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map(d => (
            <Card key={d._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{d.title}</span>
                  <Badge variant={d.urgency === 'Critical' ? 'destructive' : d.urgency === 'Routine' ? 'secondary' : 'outline'}>{d.urgency}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">{d.summary?.short || "No summary"}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">View Full Document</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {docs.length === 0 && !loading && <div className="text-sm text-muted-foreground">No documents yet.</div>}
        </div>
      </div>
    </section>
  );
}
