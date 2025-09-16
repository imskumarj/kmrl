import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await apiFetch<{ users: any[] }>("/api/admin/users");
      setUsers(res.users);
    } catch (e: any) {
      setError("Admin access required");
    }
  }

  useEffect(()=>{ load(); },[]);

  async function setRole(id: string, role: string) {
    await apiFetch(`/api/admin/users/${id}/role`, { method: "PATCH", body: { role } });
    await load();
  }

  return (
    <section className="py-10">
      <div className="container px-4">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {["Admin","Engineer","HR","Procurement","Finance","Executive"].map(r => (
                      <Button key={r} size="sm" variant={u.role===r?"default":"outline"} onClick={()=>setRole(u._id, r)}>{r}</Button>
                    ))}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={4}>No users or insufficient permissions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
