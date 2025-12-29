export type Product = {
  _id: string;
  name: string;
  code: string;
  price?: number;
  description?: string;
  images?: string[];
  isFeatured?: boolean;
  featuredOrder?: number;
  dealPercent?: number;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
