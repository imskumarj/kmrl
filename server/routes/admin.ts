import { RequestHandler } from "express";
import User from "../models/User";
import { isDemo, demoUsers } from "../demo";

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (isDemo()) return next();
  // @ts-ignore
  const role = req.user?.role as string | undefined;
  if (role !== "Admin") return res.status(403).json({ error: "Admin only" });
  next();
};

export const listUsers: RequestHandler = async (_req, res) => {
  if (isDemo()) {
    return res.json({ users: demoUsers.map(u => ({ _id: u.id, name: u.name, email: u.email, role: u.role })) });
  }
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
  res.json({ users });
};

export const updateUserRole: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body as { role: string };
  const allowed = ["Admin", "Engineer", "HR", "Procurement", "Finance", "Executive"];
  if (!allowed.includes(role)) return res.status(400).json({ error: "Invalid role" });
  if (isDemo()) {
    const u = demoUsers.find(u => u.id === id);
    if (u) u.role = role;
    return res.json({ user: u });
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("name email role");
  res.json({ user });
};
