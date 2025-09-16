import { RequestHandler } from "express";
import Compliance from "../models/Compliance";
import { isDemo, demoCompliance } from "../demo";

export const listCompliance: RequestHandler = async (_req, res) => {
  if (isDemo()) {
    return res.json({ items: demoCompliance });
  }
  const items = await Compliance.find().sort({ dueDate: 1 }).limit(200);
  res.json({ items });
};
