import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDB } from "./db";
import { signup, login, me } from "./routes/auth";
import { authRequired } from "./middleware/auth";
import { createDoc, listDocs, starDoc } from "./routes/documents";
import { listCompliance } from "./routes/compliance";
import { listUsers, updateUserRole, requireAdmin } from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // DB (skip in demo mode)
  if (process.env.DEMO_MODE === "false") {
    connectDB().catch((e) => {
      console.error("DB connection error", e);
    });
  }

  // Health
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo
  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", authRequired, me);

  // Documents
  app.get("/api/documents", authRequired, listDocs);
  app.post("/api/documents", authRequired, createDoc);
  app.post("/api/documents/:id/star", authRequired, starDoc);

  // Compliance
  app.get("/api/compliance", authRequired, listCompliance);

  // Admin
  app.get("/api/admin/users", authRequired, requireAdmin, listUsers);
  app.patch("/api/admin/users/:id/role", authRequired, requireAdmin, updateUserRole);

  return app;
}
