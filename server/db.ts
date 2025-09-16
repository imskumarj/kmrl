import mongoose from "mongoose";

export async function connectDB(uri?: string) {
  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is not set");
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB || "kmrl-db",
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err);
  });
}
