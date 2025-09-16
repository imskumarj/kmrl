import type { Request } from "express";

export function isDemo() {
  return process.env.DEMO_MODE !== "false";
}

export type DemoUser = { id: string; name: string; email: string; role: string; pinnedDocIds: string[] };
export const demoUsers: DemoUser[] = [
  { id: "u1", name: "Admin Demo", email: "admin@cloudmetro.app", role: "Admin", pinnedDocIds: [] },
  { id: "u2", name: "Engineer Demo", email: "eng@cloudmetro.app", role: "Engineer", pinnedDocIds: [] },
  { id: "u3", name: "Procurement Demo", email: "proc@cloudmetro.app", role: "Procurement", pinnedDocIds: [] },
  { id: "u4", name: "HR Demo", email: "hr@cloudmetro.app", role: "HR", pinnedDocIds: [] },
  { id: "u5", name: "Finance Demo", email: "fin@cloudmetro.app", role: "Finance", pinnedDocIds: [] },
  { id: "u6", name: "Executive Demo", email: "exec@cloudmetro.app", role: "Executive", pinnedDocIds: [] },
];

export type DemoDoc = {
  _id: string;
  title: string;
  department: "Engineer" | "HR" | "Procurement" | "Finance" | "Executive";
  type?: string;
  content?: string;
  summary?: { short?: string; bullets?: string[]; detailed?: string };
  urgency: "Critical" | "Routine" | "Reference";
};

export const demoDocs: DemoDoc[] = [
  {
    _id: "d1",
    title: "IoT Sensor Calibration Update",
    department: "Engineer",
    type: "Maintenance",
    content:
      "Update to sensor calibration schedule. Review clause 3.2. Action required within 3 days.",
    summary: { short: "Review clause 3.2 and update schedule.", bullets: ["Calibration due in 3 days", "Affects Line 1"], detailed: "Detailed summary..." },
    urgency: "Critical",
  },
  {
    _id: "d2",
    title: "Vendor SLA Revision",
    department: "Procurement",
    type: "Contract",
    content: "Revised SLA from Vendor ABC. Approve changes and sign by 10 Oct.",
    summary: { short: "Approve revised SLA by 10 Oct.", bullets: ["Clause 5 updated", "Penalty terms clarified"], detailed: "Detailed summary..." },
    urgency: "Routine",
  },
  {
    _id: "d3",
    title: "Board Meeting Minutes",
    department: "Executive",
    type: "Minutes",
    content: "KPI review and compliance updates.",
    summary: { short: "KPIs reviewed; compliance on track.", bullets: ["Revenue +8%", "Safety metrics stable"], detailed: "Detailed summary..." },
    urgency: "Reference",
  },
  {
    _id: "d4",
    title: "HR Policy Update: Training Schedule Q4",
    department: "HR",
    type: "Policy",
    content: "Mandatory safety and compliance training schedule for Q4.",
    summary: { short: "Publish Q4 training schedule.", bullets: ["Safety training", "Compliance refresher"], detailed: "Detailed summary..." },
    urgency: "Routine",
  },
  {
    _id: "d5",
    title: "Finance: Payment Notice for PO-9821",
    department: "Finance",
    type: "Payment",
    content: "Vendor invoice matched to PO-9821. Payment due in 10 days.",
    summary: { short: "Process payment for PO-9821 in 10 days.", bullets: ["Invoice matched", "Three-way check passed"], detailed: "Detailed summary..." },
    urgency: "Due Soon" as any,
  },
];

export const demoCompliance = [
  { _id: "c1", title: "CMRS Safety Circular 24-07", authority: "CMRS", status: "Pending", dueDate: new Date(Date.now() + 86400000 * 7), link: "#" },
  { _id: "c2", title: "MoHUA Procurement Advisory", authority: "MoHUA", status: "Due Soon", dueDate: new Date(Date.now() + 86400000 * 14), link: "#" },
  { _id: "c3", title: "Energy Efficiency Compliance", authority: "Other", status: "Complied", dueDate: null, link: "#" },
];

export function demoUserFromReq(req: Request): DemoUser {
  const email = (req.body?.email as string) || (req.query?.email as string) || "admin@cloudmetro.app";
  return demoUsers.find((u) => u.email === email) || demoUsers[0];
}
