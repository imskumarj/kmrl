import { RequestHandler } from "express";
import Document from "../models/Document";
import User from "../models/User";
import { isDemo, demoDocs, demoUsers } from "../demo";

export const listDocs: RequestHandler = async (req, res) => {
  const { department, urgency, type, q } = req.query as Record<string, string>;
  if (isDemo()) {
    const rx = q ? new RegExp(q, "i") : null;
    const items = demoDocs.filter((d) =>
      (!department || d.department === department) &&
      (!urgency || d.urgency === (urgency as any)) &&
      (!type || d.type === type) &&
      (!rx || rx.test(d.title) || rx.test(d.content || ""))
    );
    return res.json({ docs: items });
  }
  const filter: any = {};
  if (department) filter.department = department;
  if (urgency) filter.urgency = urgency;
  if (type) filter.type = type;
  if (q) filter.$or = [{ title: new RegExp(q, "i") }, { content: new RegExp(q, "i") }];
  const docs = await Document.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json({ docs });
};

export const createDoc: RequestHandler = async (req, res) => {
  const { title, department, type, content } = req.body as Record<string, string>;
  if (!title || !department) return res.status(400).json({ error: "Missing fields" });
  if (isDemo()) {
    const summary = buildSummary(content || "");
    const doc = { _id: `d${demoDocs.length + 1}`, title, department: department as any, type, content, summary, urgency: summary.urgency } as any;
    demoDocs.unshift(doc);
    return res.json({ doc });
  }
  const summary = buildSummary(content || "");
  const doc = await Document.create({ title, department, type, content, summary, urgency: summary.urgency });
  res.json({ doc });
};

export const starDoc: RequestHandler = async (req, res) => {
  // @ts-ignore
  const userId = req.user?.id as string;
  const { id } = req.params;
  if (isDemo()) {
    const user = demoUsers[0];
    const exists = user.pinnedDocIds.includes(id);
    if (exists) user.pinnedDocIds = user.pinnedDocIds.filter((d) => d !== id);
    else user.pinnedDocIds.push(id);
    return res.json({ pinned: !exists });
  }
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const exists = user.pinnedDocIds?.some((d) => String(d) === id);
  if (exists) {
    user.pinnedDocIds = user.pinnedDocIds?.filter((d) => String(d) !== id) as any;
  } else {
    (user.pinnedDocIds as any).push(id);
  }
  await user.save();
  res.json({ pinned: !exists });
};

function buildSummary(text: string) {
  const t = text.trim();
  const first = t.split(/(?<=[.!?])\s+/)[0] || "";
  const bullets = t ? t.split(/(?<=[.!?])\s+/).slice(0, 5) : [];
  const urgency: any = /urgent|immediately|critical/i.test(t) ? "Critical" : /review|action/i.test(t) ? "Routine" : "Reference";
  return { short: first, bullets, detailed: t.slice(0, 1000), urgency };
}
