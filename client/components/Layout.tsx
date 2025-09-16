import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, FileUp, Search, Bell, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const nav = [
    { to: "/upload", label: "Upload" },
    { to: "/search", label: "Search" },
    { to: "/compliance", label: "Compliance" },
    { to: "/knowledge", label: "Knowledge Hub" },
    { to: "/dashboards", label: "Dashboards" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary to-primary/70 grid place-items-center text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="font-extrabold tracking-tight text-[15px] sm:text-base">
                  Cloud Metro
                </div>
                <div className="text-xs text-muted-foreground -mt-0.5">
                  Intelligence Platform
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition",
                      isActive && "text-foreground bg-accent",
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link to="/upload">
                  <FileUp className="mr-2" /> Upload
                </Link>
              </Button>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setOpen((v) => !v)}
              >
                <Menu />
              </Button>
            </div>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t">
            <div className="container px-4 py-2 grid gap-1">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition block",
                      isActive && "text-foreground bg-accent",
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <div className="flex gap-2 pt-1">
                <Button asChild className="flex-1">
                  <Link to="/upload">
                    <FileUp className="mr-2" /> Upload
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="flex-1">
                  <Link to="/login">Login</Link>
                </Button>
                <div className="flex-1 flex items-center justify-end">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-white/60 dark:bg-background/60">
        <div className="container px-4 py-8 grid gap-6 md:grid-cols-3 items-start">
          <div>
            <div className="font-bold">Cloud Metro</div>
            <p className="text-sm text-muted-foreground mt-2">
              AI-powered summaries, multilingual insights, and compliance-ready
              workflows.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-2">Quick Links</div>
            <div className="grid gap-2 text-sm">
              <Link
                to="/search"
                className="hover:underline inline-flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Smart Search
              </Link>
              <Link
                to="/compliance"
                className="hover:underline inline-flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Compliance Alerts
              </Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-2">Contact</div>
            <p className="text-sm text-muted-foreground">
              For demos/feedback, reach the SIH team via the contact form on the
              About page.
            </p>
          </div>
        </div>
        <div className="border-t">
          <div className="container px-4 py-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cloud Metro. Built with React, Node.js,
            Express, MongoDB.
          </div>
        </div>
      </footer>
    </div>
  );
}
