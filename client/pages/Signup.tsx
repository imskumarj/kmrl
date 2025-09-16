import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiFetch, setToken } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";

const roles = ["Admin","Engineer","HR","Procurement","Finance","Executive"] as const;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof roles)[number]>("Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ token: string }>("/api/auth/signup", { method: "POST", body: { name, email, password, role } });
      setToken(res.token);
      navigate("/dashboards");
    } catch (e: any) {
      setError("Unable to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-10">
      <div className="container px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={submit}>
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <select className="h-10 rounded-md border bg-background px-3 text-sm" value={role} onChange={(e)=>setRole(e.target.value as any)}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Sign up"}</Button>
            </form>
            <p className="text-sm text-muted-foreground mt-3">Already have an account? <Link className="underline" to="/login">Login</Link></p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
