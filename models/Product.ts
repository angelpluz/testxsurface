import mongoose, { Schema } from "mongoose";

export type ProductDocument = mongoose.Document & {
  name: string;
  code: string;
  price?: number;
  description?: string;
  images?: string[];
  isFeatured?: boolean;
  featuredOrder?: number;
  dealPercent?: number;
  inStock?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const ProductSchema = new Schema<ProductDocument>(
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
ProductSchema.index({ isFeatured: 1, featuredOrder: 1, createdAt: -1 });

const ProductModel = mongoose.models.Product || mongoose.model<ProductDocument>("Product", ProductSchema);

export default ProductModel;
