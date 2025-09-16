import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { signToken } from "../middleware/auth";
import { isDemo, demoUsers, demoUserFromReq } from "../demo";

export const signup: RequestHandler = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  if (isDemo()) {
    const u = { id: "demo", name, email, role: role || "Engineer" } as any;
    return res.json({ token: "demo-token", user: u });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken(String(user._id), user.role as string);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  // 🔑 Hardcoded Admin Access
  if (email === "admin@kkmrl.in" && password === "Admin@123") {
    const adminUser = {
      id: "admin",
      name: "Super Admin",
      email: "admin@kkmrl.in",
      role: "Admin"
    };
    const token = signToken(adminUser.id, adminUser.role);
    return res.json({ token, user: adminUser });
  }

  // Demo mode check
  if (isDemo()) {
    const u = demoUserFromReq(req);
    return res.json({
      token: "demo-token",
      user: { id: u.id, name: u.name, email: u.email, role: u.role }
    });
  }

  // Regular DB login
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(String(user._id), user.role as string);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const me: RequestHandler = async (req, res) => {
  // @ts-ignore
  const id = req.user?.id;
  if (isDemo()) {
    const u = demoUsers[0];
    return res.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role, pinnedDocIds: u.pinnedDocIds } });
  }
  if (!id) return res.status(401).json({ error: "Unauthorized" });
  const user = await User.findById(id).select("name email role pinnedDocIds");
  res.json({ user });
};
