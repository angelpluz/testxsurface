import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables.");
}

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    price: { type: Number, min: 0 },
    description: { type: String, trim: true },
    images: { type: [{ type: String, trim: true }], default: [] },
    isFeatured: { type: Boolean, default: false },
    featuredOrder: { type: Number, default: 0 },
    dealPercent: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const run = async () => {
  await mongoose.connect(MONGODB_URI);
  const result = await Product.updateMany(
    { isFeatured: true },
    { $set: { dealPercent: 50 } }
  );
  console.log(
    `Updated ${result.modifiedCount ?? 0} product(s) with dealPercent=50 (isFeatured=true).`
  );
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Update failed:", error);
  process.exit(1);
});
