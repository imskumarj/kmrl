import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Knowledge() {
  const [docs, setDocs] = useState<any[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineer");
  const [content, setContent] = useState("");

  async function load() {
    const me = await apiFetch<{ user: { pinnedDocIds?: string[] } }>("/api/auth/me");
    setPinned(me.user.pinnedDocIds || []);
    const res = await apiFetch<{ docs: any[] }>("/api/documents");
    setDocs(res.docs);
  }
  useEffect(()=>{ load(); },[]);

  async function create() {
    if (!title) return;
    await apiFetch("/api/documents", { method: "POST", body: { title, department, content } });
    setTitle(""); setContent("");
    await load();
  }

  async function toggleStar(id: string) {
    const res = await apiFetch<{ pinned: boolean }>(`/api/documents/${id}/star`, { method: "POST" });
    setPinned(prev => {
      const isPinned = prev.includes(id);
      if (res.pinned && !isPinned) return [...prev, id];
      if (!res.pinned && isPinned) return prev.filter(x => x !== id);
      return prev;
    });
  }

  return (
    <section className="py-10">
      <div className="container px-4">
        <h1 className="text-2xl font-bold mb-4">Knowledge Hub</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={department} onChange={(e)=>setDepartment(e.target.value)}>
            {["Engineer","Procurement","HR","Finance","Executive"].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <Button onClick={create}>Create</Button>
          <textarea className="md:col-span-3 h-28 rounded-md border bg-background p-3 text-sm" placeholder="Content (optional)" value={content} onChange={(e)=>setContent(e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map(d => {
            const isPinned = pinned.includes(d._id);
            return (
              <Card key={d._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{d.title}</span>
                    <Button size="sm" variant={isPinned?"default":"outline"} onClick={()=>toggleStar(d._id)}>{isPinned?"Unstar":"Star"}</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{d.content?.slice(0,160) || d.summary?.short}</div>
                </CardContent>
              </Card>
            );
          })}
          {docs.length === 0 && <div className="text-sm text-muted-foreground">No documents</div>}
        </div>
      </div>
    </section>
  );
}
