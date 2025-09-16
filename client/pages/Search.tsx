import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const departments = ["","Engineer","Procurement","HR","Finance","Executive"] as const;
const urgencies = ["","Critical","Routine","Reference"] as const;

export default function Search() {
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState<typeof departments[number]>("");
  const [urgency, setUrgency] = useState<typeof urgencies[number]>("");
  const [docs, setDocs] = useState<any[]>([]);

  async function run() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (department) params.set("department", department);
    if (urgency) params.set("urgency", urgency);
    const res = await apiFetch<{ docs: any[] }>(`/api/documents?${params.toString()}`);
    setDocs(res.docs);
  }

  useEffect(() => { run(); }, []);

  return (
    <section className="py-10">
      <div className="container px-4">
        <h1 className="text-2xl font-bold mb-4">Smart Search</h1>
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <Input placeholder="Search (semantic + keyword)" value={q} onChange={(e)=>setQ(e.target.value)} />
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={department} onChange={(e)=>setDepartment(e.target.value as any)}>
            {departments.map(d => <option key={d} value={d}>{d || "All Departments"}</option>)}
          </select>
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={urgency} onChange={(e)=>setUrgency(e.target.value as any)}>
            {urgencies.map(u => <option key={u} value={u}>{u || "Any Urgency"}</option>)}
          </select>
          <Button onClick={run}>Search</Button>
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
                <div className="text-sm text-muted-foreground">{d.summary?.short || d.content?.slice(0,120)}</div>
              </CardContent>
            </Card>
          ))}
          {docs.length === 0 && <div className="text-sm text-muted-foreground">No results</div>}
        </div>
      </div>
    </section>
  );
}
