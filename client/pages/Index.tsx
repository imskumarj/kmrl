import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Languages, ScanText, Sparkles, Tags, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-transparent to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-60px] bottom-[-60px] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="container px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="mb-4">Metro-ready SaaS</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Cloud Metro Smart Document Intelligence Platform
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Turn PDFs and scans into instant, multilingual insights. Summaries, compliance alerts, and role-based dashboards built for public infrastructure teams.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="">
                  <Link to="/upload"><FileUp className="mr-2"/> Upload Document</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/login">Login as User</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/admin">Admin Dashboard <ArrowRight className="ml-2"/></Link>
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-md border bg-secondary text-secondary-foreground p-3 flex items-center gap-3"><ScanText className="text-primary"/> OCR + Extraction</div>
                <div className="rounded-md border bg-secondary text-secondary-foreground p-3 flex items-center gap-3"><Sparkles className="text-primary"/> AI Summaries</div>
                <div className="rounded-md border bg-secondary text-secondary-foreground p-3 flex items-center gap-3"><Languages className="text-primary"/> English / Malayalam</div>
              </div>
            </div>
            <div>
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
                <div className="grid grid-cols-5 gap-3">
                  {[{icon: ScanText, label: 'OCR'}, {icon: Sparkles, label: 'Summarize'}, {icon: Languages, label: 'Translate'}, {icon: Tags, label: 'Classify'}, {icon: Database, label: 'Store'}].map((s, i) => (
                    <div key={s.label} className="text-center">
                      <div className="h-12 w-12 mx-auto rounded-lg grid place-items-center bg-primary/10 text-primary">
                        {<s.icon />}
                      </div>
                      <div className="text-xs mt-2 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">Live preview</div>
                  <div className="mt-2 rounded-lg border bg-card p-4">
                    <div className="text-xs text-muted-foreground">Auto-generated Summary</div>
                    <p className="mt-2 text-sm">Procurement contract updated. Action: Review clause 3.2 and approve revised vendor SLA by 10 Oct. Urgency: Critical</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Role-Based Dashboards</h2>
            <Button asChild variant="outline"><Link to="/dashboards">Explore Dashboards</Link></Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Engineer", blurb: "Design changes, maintenance cards, IoT alerts.", urgency: "Critical" },
              { title: "Procurement", blurb: "Vendor invoices, contracts, and SLAs.", urgency: "Routine" },
              { title: "Executive", blurb: "Compliance updates and KPIs.", urgency: "Reference" },
            ].map((d) => (
              <Card key={d.title}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{d.title} Dashboard</span>
                    <Badge variant={d.urgency === 'Critical' ? 'destructive' : d.urgency === 'Routine' ? 'secondary' : 'outline'}>{d.urgency}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{d.blurb}</div>
                  <div className="mt-3 rounded-md border p-3 bg-muted">
                    <div className="text-xs text-muted-foreground">Latest summary</div>
                    <p className="text-sm mt-1">Track document updates and take action directly from the card. Click to view the full document.</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm"><Link to="/dashboards">View Full Document</Link></Button>
                    <Button asChild size="sm" variant="outline"><Link to="/search">Search</Link></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-background to-muted/40 dark:from-background dark:to-slate-900">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "AI Summarization", desc: "1-line action items, bullet points, and detailed view.", icon: Sparkles },
              { title: "Multilingual", desc: "Instant English ↔ Malayalam toggle.", icon: Languages },
              { title: "Compliance Alerts", desc: "CMRS and MoHUA directives with R/Y/G status.", icon: Tags },
            ].map((f) => (
              <Card key={f.title}>
                <CardHeader className="flex-row items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center">
                    {<f.icon />}
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
