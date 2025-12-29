import { headers } from "next/headers";
import { notFound } from "next/navigation";

import ProductDetailView from "@/components/ProductDetailView";
import type { Product } from "@/types/product";

async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

async function fetchProduct(id: string) {
  const response = await fetch(`${await getBaseUrl()}/api/products/${id}`, { cache: "no-store" });
  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) {
    throw new Error("Failed to load product");
  }
  const data = (await response.json()) as { product: Product };
  return data.product;
}

async function fetchRelated(id: string) {
  const response = await fetch(`${await getBaseUrl()}/api/products?limit=4`, { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as { products?: Product[] };
  const products = Array.isArray(data.products) ? data.products : [];
  return products.filter((product) => product._id !== id).slice(0, 3);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) {
    notFound();
  }

  const related = await fetchRelated(id);

  return <ProductDetailView product={product} related={related} />;
}
