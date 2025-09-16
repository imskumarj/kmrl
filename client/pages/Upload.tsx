import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, Download, FileText, Languages, ScanText, Sparkles, Tags } from "lucide-react";

const pipeline = [
  { key: "ocr", label: "OCR", icon: ScanText },
  { key: "summarize", label: "Summarization", icon: Sparkles },
  { key: "translate", label: "Translation", icon: Languages },
  { key: "classify", label: "Classification", icon: Tags },
  { key: "store", label: "Storage", icon: Database },
] as const;

type StageKey = typeof pipeline[number]["key"];

export default function Upload() {
  const [fileName, setFileName] = useState<string>("");
  const [rawText, setRawText] = useState<string>("");
  const [lang, setLang] = useState<"en" | "ml">("en");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setFileName(file.name);
    setRunning(true);
    setStageIndex(0);
    setProgress(0);
    // Simulate OCR text extraction
    setTimeout(() => {
      setRawText(
        "Vendor ABC submitted revised maintenance schedule for Kochi Metro Line 1. Please review clause 3.2 related to IoT sensor calibration and approve the updated SLA by 10 Oct. Ensure compliance with MoHUA circular 2024/CMRS."
      );
    }, 600);
  }

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const np = Math.min(100, p + 5);
        return np;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [running]);

  // advance stages when progress hits 100
  useEffect(() => {
    if (!running) return;
    if (progress >= 100) {
      setProgress(0);
      setStageIndex((i) => {
        const ni = i + 1;
        if (ni >= pipeline.length) {
          setRunning(false);
          return pipeline.length - 1;
        }
        return ni;
      });
    }
  }, [progress, running]);

  const summary = useMemo(() => buildSummary(rawText, lang), [rawText, lang]);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function exportPrint() {
    const content = `Cloud Metro Smart Document Intelligence\n\nFile: ${fileName || "Manual text"}\nLanguage: ${lang === "en" ? "English" : "Malayalam"}\n\nAction Item Summary\n${summary.oneLine}\n\nBullet Points\n${summary.bullets.map((b) => `• ${b}`).join("\n")}\n\nStructured Summary\n${summary.structured}`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<pre style="font-family:Inter,ui-sans-serif,system-ui;white-space:pre-wrap;line-height:1.6;padding:24px">${content}</pre>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <section className="py-10">
      <div className="container px-4 grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upload Document</span>
                {fileName && <Badge variant="secondary">{fileName}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="rounded-lg border border-dashed bg-muted p-6 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <FileText className="text-primary" />
                  <div className="text-sm text-muted-foreground">Drop PDF/DOCX/Image/WhatsApp PDF here</div>
                  <div className="text-xs text-muted-foreground">or</div>
                  <div className="flex gap-2">
                    <Input ref={inputRef} type="file" accept=".pdf,.doc,.docx,image/*" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }} />
                    <Button onClick={() => inputRef.current?.click()}>Browse</Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-5 gap-3">
                {pipeline.map((s, i) => (
                  <div key={s.key} className="text-center">
                    <div className={`h-12 w-12 mx-auto rounded-lg grid place-items-center ${i <= stageIndex ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div className="text-xs mt-2 font-medium">{s.label}</div>
                    {i === stageIndex && running && (
                      <div className="mt-2"><Progress value={progress} /></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted Text (OCR)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea rows={6} value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Paste raw text or wait for OCR simulation..." />
              <div className="mt-3 text-xs text-muted-foreground">Tip: Paste any text to simulate processing without a file.</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI Summary</span>
                <div className="flex gap-2">
                  <Button size="sm" variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")}>English</Button>
                  <Button size="sm" variant={lang === "ml" ? "default" : "outline"} onClick={() => setLang("ml")}>Malayalam</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="text-xs text-muted-foreground">1-line Action Item</div>
                <p className="font-medium mt-1">{summary.oneLine}</p>

                <div className="mt-4">
                  <div className="text-xs text-muted-foreground">Bullet Point Summary</div>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {summary.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-muted-foreground">Detailed Structured Summary</div>
                  <div className="mt-1 rounded-md border p-3 bg-muted whitespace-pre-wrap">{summary.structured}</div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={exportPrint}><Download className="mr-2"/>Export as PDF</Button>
                  <Button variant="outline" asChild>
                    <a href="#upload" onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'});}}>Trace back to Original Document</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function buildSummary(input: string, lang: "en" | "ml") {
  const text = input?.trim() || "";
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const oneLineEn = sentences[0] || "No content available";
  const bulletsEn = sentences.slice(0, 4).map((s) => s.replace(/\s+/g, " "));
  const structuredEn = `Context\n${text.slice(0, 220) || "(awaiting OCR text)"}\n\nActions\n- Review critical clauses and approve pending items.\n- Verify compliance references (CMRS/MoHUA).\n\nRouting\n- Procurement → Contracts\n- Engineer → Maintenance\n- Executive → Compliance`;

  const translate = (s: string) => simpleMalayalam(s);

  if (lang === "ml") {
    return {
      oneLine: translate(oneLineEn),
      bullets: bulletsEn.map(translate),
      structured: translate(structuredEn),
    };
  }
  return { oneLine: oneLineEn, bullets: bulletsEn, structured: structuredEn };
}

function simpleMalayalam(s: string) {
  // Very light-weight demo translation (word swaps) just for hackathon preview
  const map: Record<string, string> = {
    Vendor: "വെൻഡർ",
    submitted: "സമർപ്പിച്ചു",
    maintenance: "മെൻറനൻസ്",
    schedule: "ഷെഡ്യൂൾ",
    approve: "അംഗീകരിക്കുക",
    updated: "അപ്ഡേറ്റുചെയ്‌തു",
    by: "മുമ്പ്",
    Ensure: "ഉറപ്പാക്കുക",
    compliance: "കമ്പ്ലയൻസ്",
    review: "റിയൂ ചെയ്യുക",
    clause: "ക്ലോസ്സ്",
    sensor: "സെൻസർ",
    calibration: "കാലിബ്രേഷൻ",
    Translation: "പരിഭാഷ",
    Storage: "സ്റ്റോറെജ്",
    Classification: "വർഗ്ഗീകരണം",
    Summarization: "സംഗ്രഹം",
    OCR: "ഓസിആർ",
  };
  return s
    .split(/(\b)/)
    .map((w) => (map[w] ? map[w] : w))
    .join("");
}
