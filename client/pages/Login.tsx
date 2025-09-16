import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiFetch, setToken } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // 🔑 Hardcoded admin bypass (frontend only)
    if (email === "admin@kkmrl.in" && password === "Admin@123") {
      const adminUser = {
        token: "admin-direct-token",
        user: {
          id: "admin",
          name: "Super Admin",
          email: "admin@kkmrl.in",
          role: "Admin",
        },
      };
      setToken(adminUser.token);
      navigate("/dashboards");
      return;
    }

    // Otherwise, go through normal backend login
    const res = await apiFetch<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    setToken(res.token);
    navigate("/dashboards");
  } catch (e: any) {
    setError("Invalid credentials");
  } finally {
    setLoading(false);
  }
}

  return (
    <section className="py-10">
      <div className="container px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={submit}>
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
            </form>
            <p className="text-sm text-muted-foreground mt-3">No account? <Link className="underline" to="/signup">Create one</Link></p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
