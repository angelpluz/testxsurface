"use client";

import Link from "next/link";
import styled from "styled-components";

import CopyCodeButton from "@/components/CopyCodeButton";
import type { Product } from "@/types/product";

const Page = styled.main`
  min-height: 100vh;
  padding: 56px 24px 96px;
  background:
    radial-gradient(520px 320px at 5% 0%, rgba(252, 232, 207, 0.6), transparent 70%),
    radial-gradient(520px 320px at 95% 10%, rgba(238, 232, 222, 0.85), transparent 70%),
    #f7f7f4;
`;

const Shell = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 32px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  color: #1b1a17;
`;

const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 28px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ImageCard = styled.div`
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(27, 26, 23, 0.08);
  box-shadow: 0 16px 40px rgba(23, 21, 18, 0.08);
  padding: 18px;
  display: grid;
  gap: 16px;
`;

const MainImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 18px;
  background: #efe7dd;
`;

const Thumbnails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
`;

const Thumb = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 12px;
  background: #efe7dd;
  border: 1px solid rgba(27, 26, 23, 0.08);
`;

const InfoCard = styled.div`
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(27, 26, 23, 0.08);
  box-shadow: 0 16px 40px rgba(23, 21, 18, 0.08);
  padding: 24px;
  display: grid;
  gap: 16px;
  align-content: start;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(24px, 3vw, 34px);
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #6b645d;
`;

const CodeTag = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(27, 26, 23, 0.08);
  font-weight: 600;
`;

const Price = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #d61f1f;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #4b4741;
`;

const DataRow = styled.div`
  font-size: 12px;
  color: #6b645d;
  display: flex;
  gap: 6px;
  align-items: center;
`;

const RelatedSection = styled.section`
  display: grid;
  gap: 16px;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`;

const RelatedCard = styled(Link)`
  border-radius: 16px;
  border: 1px solid rgba(27, 26, 23, 0.08);
  background: #ffffff;
  padding: 14px;
  text-decoration: none;
  color: inherit;
  display: grid;
  gap: 8px;
  box-shadow: 0 12px 30px rgba(23, 21, 18, 0.06);
`;

const RelatedTitle = styled.h3`
  margin: 0;
  font-size: 14px;
`;

const RelatedMeta = styled.span`
  font-size: 12px;
  color: #8b857d;
`;

const BAHT_SYMBOL = "฿";

const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23efe7dd'/%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='url(%23grid)'/%3E%3Cdefs%3E%3Cpattern id='grid' width='12' height='12' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 0h12v12H0z' fill='%23efe7dd'/%3E%3Cpath d='M0 0h12M0 0v12' stroke='%23e1d7c8' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3C/svg%3E";

function formatPrice(price?: number) {
  if (price === undefined || price === null) return "-";
  return `${BAHT_SYMBOL}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)}`;
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default function ProductDetailView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage = images[0] || placeholderImage;

  return (
    <Page>
      <Shell>
        <BackLink href="/products">
          <span aria-hidden="true">&larr;</span>
          Back to Products
        </BackLink>

        <Layout>
          <ImageCard>
            <MainImage src={mainImage} alt={product.name} />
            {images.length > 1 ? (
              <Thumbnails>
                {images.slice(0, 4).map((image) => (
                  <Thumb key={image} src={image} alt={product.name} />
                ))}
              </Thumbnails>
            ) : null}
          </ImageCard>

          <InfoCard>
            <Title>{product.name}</Title>
            <MetaRow>
              <CodeTag>{product.code}</CodeTag>
              <CopyCodeButton code={product.code} />
            </MetaRow>
            <Price>{formatPrice(product.price)}</Price>
            {product.description ? <Description>{product.description}</Description> : null}
            <DataRow>
              <span>Created:</span>
              <span>{formatDate(product.createdAt)}</span>
            </DataRow>
          </InfoCard>
        </Layout>

        <RelatedSection>
          <Title style={{ fontSize: "20px" }}>Related Products</Title>
          {related.length === 0 ? (
            <DataRow>No related products yet.</DataRow>
          ) : (
            <RelatedGrid>
              {related.map((item) => (
                <RelatedCard key={item._id} href={`/products/${item._id}`}>
                  <RelatedTitle>{item.name}</RelatedTitle>
                  <RelatedMeta>{item.code}</RelatedMeta>
                  <RelatedMeta>{formatPrice(item.price)}</RelatedMeta>
                </RelatedCard>
              ))}
            </RelatedGrid>
          )}
        </RelatedSection>
      </Shell>
    </Page>
  );
}
