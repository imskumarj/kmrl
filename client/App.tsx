import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import { ThemeProvider } from "./components/ThemeProvider";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboards from "./pages/Dashboards";
import Search from "./pages/Search";
import Compliance from "./pages/Compliance";
import Knowledge from "./pages/Knowledge";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/search" element={<Search />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/dashboards" element={<Dashboards />} />
              <Route path="/admin" element={<AdminPageLazy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

import { lazy, Suspense } from "react";
const AdminLazy = lazy(() => import("./pages/Admin"));
function AdminPageLazy() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading admin...</div>}>
      <AdminLazy />
    </Suspense>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
