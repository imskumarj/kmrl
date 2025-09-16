import mongoose, { Schema, InferSchemaType } from "mongoose";

const DocSchema = new Schema(
  {
    title: { type: String, required: true },
    department: {
      type: String,
      enum: ["Engineer", "HR", "Procurement", "Finance", "Executive"],
      index: true,
    },
    type: { type: String, default: "General", index: true },
    content: { type: String, default: "" },
    summary: { short: String, bullets: [String], detailed: String },
    urgency: { type: String, enum: ["Critical", "Routine", "Reference"], default: "Routine", index: true },
    sourceUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    starredBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export type DocumentT = InferSchemaType<typeof DocSchema> & { _id: any };
export default mongoose.models.Document || mongoose.model("Document", DocSchema);
