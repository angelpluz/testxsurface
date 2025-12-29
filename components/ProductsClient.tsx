"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

import type { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";
import SearchBar from "./SearchBar";

const USE_MOCKS = process.env.NEXT_PUBLIC_PRODUCTS_SOURCE === "mock";

const MOCK_PRODUCTS: Product[] = Array.from({ length: 15 }, (_, index) => ({
  _id: `mock-${index + 1}`,
  name: "Product name",
  code: "Code",
  price: 1000,
}));

const Panel = styled.section`
  position: relative;
  display: grid;
  gap: 18px;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: var(--accent, #c2392c);
`;

const EmptyState = styled.div`
  padding: 22px;
  border-radius: 18px;
  border: 1px dashed var(--border-soft, #e2dcd3);
  background: rgba(255, 255, 255, 0.72);
  color: var(--muted, #7d746b);
  font-size: 13px;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export default function ProductsClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    if (USE_MOCKS) {
      const query = debouncedSearch.toLowerCase();
      const filtered = query
        ? MOCK_PRODUCTS.filter(
            (product) =>
              product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query)
          )
        : MOCK_PRODUCTS;

      setProducts(filtered);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
        const response = await fetch(`/api/products${params}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Unable to load products.");
        }
        const data = (await response.json()) as { products: Product[] };
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unexpected error.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [debouncedSearch]);

  const showEmpty = !loading && !error && products.length === 0;
  const showError = Boolean(error);

  return (
    <Panel>
      <SearchBar value={search} onChange={setSearch} placeholder="Name, Catalogue, Code" />
      <VisuallyHidden role="status" aria-live="polite">
        {loading ? "Loading products" : `${products.length} products`}
      </VisuallyHidden>
      {showError ? <ErrorText>{error}</ErrorText> : null}
      {showEmpty ? <EmptyState>No products found. Try a different search.</EmptyState> : null}
      {products.length > 0 ? (
        <ProductGrid products={products} interactive={!USE_MOCKS} />
      ) : null}
    </Panel>
  );
}
