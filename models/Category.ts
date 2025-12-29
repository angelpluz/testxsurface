import mongoose, { Schema } from "mongoose";

export type CategoryDocument = mongoose.Document & {
  name: string;
  slug: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
};

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ name: "text", slug: "text" });

const CategoryModel =
  mongoose.models.Category || mongoose.model<CategoryDocument>("Category", CategorySchema);

export default CategoryModel;
