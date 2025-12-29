"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import { AUTH_KEY } from "@/lib/auth";
import type { Product } from "@/types/product";

const Card = styled.article`
  display: grid;
  gap: 8px;
  border-radius: 16px;
  border: 1px solid var(--border-strong, rgba(27, 26, 23, 0.08));
  background: var(--surface, #ffffff);
  box-shadow: var(--shadow-soft, 0 12px 28px rgba(23, 21, 18, 0.08));
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-strong, 0 16px 36px rgba(23, 21, 18, 0.12));
  }
`;

const CardLink = styled(Link)`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--accent-soft, #cfa879);
    outline-offset: 4px;
  }
`;

const CardStatic = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  color: inherit;
`;

const ImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  position: relative;
  background:
    repeating-linear-gradient(
      90deg,
      #eadcc6,
      #eadcc6 3px,
      #f0e4d2 3px,
      #f0e4d2 6px
    );
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Accent = styled.span`
  position: absolute;
  bottom: 10px;
  left: 12px;
  width: 22px;
  height: 3px;
  border-radius: 999px;
  background: var(--accent, #e0483a);
`;

const Body = styled.div`
  padding: 12px 12px 14px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: end;
`;

const Info = styled.div`
  display: grid;
  gap: 2px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink, #2c2925);
`;

const Meta = styled.p`
  margin: 0;
  font-size: 11px;
  color: var(--muted, #9c948b);
`;

const Price = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 12px;
  color: var(--accent, #e0483a);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 12px 12px;
`;

const EditLink = styled(Link)`
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  color: #0f5d55;
`;

const BAHT_SYMBOL = "฿";

type ProductCardProps = {
  product: Product;
  interactive?: boolean;
};

function formatPrice(price?: number) {
  if (price === undefined || price === null) return `${BAHT_SYMBOL}-`;
  return `${BAHT_SYMBOL}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)}`;
}

export default function ProductCard({ product, interactive = true }: ProductCardProps) {
  const imageUrl = product.images?.[0];
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAuthed(window.sessionStorage.getItem(AUTH_KEY) === "true");
  }, []);
  const content = (
    <>
      <ImageWrap>
        {imageUrl ? <ProductImage src={imageUrl} alt={product.name} loading="lazy" /> : null}
        <Accent aria-hidden="true" />
      </ImageWrap>
      <Body>
        <Info>
          <Title>{product.name}</Title>
          <Meta>{product.code ?? "Code"}</Meta>
        </Info>
        <Price>{formatPrice(product.price)}</Price>
      </Body>
    </>
  );

  return (
    <Card>
      {interactive ? (
        <CardLink href={`/products/${product._id}`} aria-label={`Open ${product.name ?? "product"}`}>
          {content}
        </CardLink>
      ) : (
        <CardStatic>{content}</CardStatic>
      )}
      {interactive && isAuthed ? (
        <Actions>
          <EditLink href={`/products/${product._id}/edit`}>Edit</EditLink>
        </Actions>
      ) : null}
    </Card>
  );
}
