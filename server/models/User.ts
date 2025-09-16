import mongoose, { Schema, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Engineer", "HR", "Procurement", "Finance", "Executive"],
      default: "Engineer",
      index: true,
    },
    pinnedDocIds: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof UserSchema> & { _id: any };
export default mongoose.models.User || mongoose.model("User", UserSchema);
