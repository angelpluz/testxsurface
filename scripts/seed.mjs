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
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", code: "text" });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ name: "text", slug: "text" });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const baseNames = [
  "Classic Oak Panel",
  "Matte Concrete Tile",
  "Warm Walnut Board",
  "Sandstone Sheet",
  "Ash Grey Laminate",
  "Ivory Marble Tile",
  "Natural Cedar Panel",
  "Studio White Sheet",
  "Terrazzo Surface",
  "Black Slate Panel",
  "Copper Accent Sheet",
  "Linen Beige Tile",
  "Smoky Pine Board",
  "Graphite Concrete",
  "Soft Clay Panel",
];

const featuredSet = new Set([0, 1, 2, 3, 4]);

const samples = baseNames.map((name, index) => {
  const code = `XSF${String(index + 1).padStart(4, "0")}`;
  const inStock = index % 4 !== 0;
  return {
    name,
    code,
    price: 1000 + index * 150,
    description: "High quality surface material for interior projects.",
    images: [`https://picsum.photos/seed/${code}/800/600`],
    isFeatured: featuredSet.has(index),
    featuredOrder: featuredSet.has(index) ? index + 1 : 0,
    dealPercent: featuredSet.has(index) ? 50 : undefined,
    inStock,
  };
});

const categorySeeds = [
  { name: "Laminate", slug: "laminate", order: 1 },
  { name: "Tile", slug: "tile", order: 2 },
  { name: "Stone", slug: "stone", order: 3 },
  { name: "Wood", slug: "wood", order: 4 },
  { name: "Mirror", slug: "mirror", order: 5 },
  { name: "WPC", slug: "wpc", order: 6 },
  { name: "Metal", slug: "metal", order: 7 },
  { name: "All Product", slug: "all-product", order: 99 },
];

const seed = async () => {
  await mongoose.connect(MONGODB_URI);
  await Product.syncIndexes();
  await Category.syncIndexes();
  await Product.deleteMany({});
  await Category.deleteMany({});
  const inserted = await Product.insertMany(samples);
  const insertedCategories = await Category.insertMany(categorySeeds);
  console.log(`Seeded ${inserted.length} products and ${insertedCategories.length} categories.`);
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
