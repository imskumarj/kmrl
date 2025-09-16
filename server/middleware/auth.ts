import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { isDemo, demoUsers } from "../demo";

export const authRequired: RequestHandler = (req, res, next) => {
  if (isDemo()) {
    // attach demo admin by default
    // @ts-ignore
    req.user = { id: demoUsers[0].id, role: demoUsers[0].role };
    return next();
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Missing token" });
  const secret = process.env.JWT_SECRET || "dev-secret";
  try {
    const payload = jwt.verify(token, secret) as { id: string; role: string };
    // @ts-ignore
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export function signToken(id: string, role: string) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign({ id, role }, secret, { expiresIn: "7d" });
}
