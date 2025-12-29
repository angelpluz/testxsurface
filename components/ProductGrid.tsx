"use client";

import styled from "styled-components";

import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 18px;
  align-items: stretch;
`;

export default function ProductGrid({
  products,
  interactive = true,
}: {
  products: Product[];
  interactive?: boolean;
}) {
  return (
    <Grid>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} interactive={interactive} />
      ))}
    </Grid>
  );
}
