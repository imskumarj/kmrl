import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function Compliance() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const res = await apiFetch<{ items: any[] }>("/api/compliance");
    setItems(res.items);
  }

  useEffect(()=>{ load(); },[]);

  const color = (s: string) => s === 'Pending' ? 'bg-red-500' : s === 'Due Soon' ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <section className="py-10">
      <div className="container px-4">
        <h1 className="text-2xl font-bold mb-4">Compliance Alerts</h1>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Authority</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Due</th>
                <th className="text-left p-3">Link</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it._id} className="border-t">
                  <td className="p-3">{it.title}</td>
                  <td className="p-3">{it.authority}</td>
                  <td className="p-3"><span className={`inline-flex h-2 w-2 rounded-full mr-2 ${color(it.status)}`}></span>{it.status}</td>
                  <td className="p-3">{it.dueDate ? new Date(it.dueDate).toLocaleDateString() : "-"}</td>
                  <td className="p-3">{it.link ? <a className="underline" href={it.link} target="_blank">Open</a> : '-'}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={5}>No directives</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
