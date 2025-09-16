import mongoose, { Schema, InferSchemaType } from "mongoose";

const ComplianceSchema = new Schema(
  {
    title: { type: String, required: true },
    authority: { type: String, enum: ["CMRS", "MoHUA", "Other"], default: "Other" },
    status: { type: String, enum: ["Pending", "Due Soon", "Complied"], default: "Pending", index: true },
    dueDate: { type: Date },
    link: { type: String },
  },
  { timestamps: true },
);

export type ComplianceT = InferSchemaType<typeof ComplianceSchema> & { _id: any };
export default mongoose.models.Compliance || mongoose.model("Compliance", ComplianceSchema);
