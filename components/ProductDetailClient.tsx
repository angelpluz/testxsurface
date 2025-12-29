"use client";

import Link from "next/link";
import styled from "styled-components";

import type { Product } from "@/types/product";

const Page = styled.main`
  min-height: 100vh;
  padding: 64px 24px 96px;
  background:
    radial-gradient(900px 500px at 100% -10%, rgba(66, 180, 167, 0.25), transparent 60%),
    radial-gradient(700px 400px at 0% 0%, rgba(255, 178, 109, 0.3), transparent 70%),
    #f5f0e7;
`;

const Shell = styled.div`
  max-width: 980px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
`;

const BackLink = styled(Link)`
  text-decoration: none;
  font-weight: 600;
  color: #0f5d55;
`;

const Card = styled.section`
  padding: 24px;
  border-radius: 24px;
  border: 1px solid rgba(27, 26, 23, 0.12);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 26px 60px rgba(27, 26, 23, 0.12);
  display: grid;
  gap: 20px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(24px, 3vw, 36px);
`;

const Meta = styled.p`
  margin: 0;
  color: #5a524b;
`;

const Price = styled.p`
  margin: 0;
  font-weight: 600;
`;

const ImageGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 4 / 3;
`;

const Description = styled.p`
  margin: 0;
  color: #5a524b;
`;

const placeholderImage = "https://picsum.photos/seed/xsf-fallback/800/600";

function formatPrice(price?: number) {
  if (price === undefined || price === null) return "Price: -";
  return `Price: ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)}`;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const images = product.images && product.images.length > 0 ? product.images : [placeholderImage];

  return (
    <Page>
      <Shell>
        <BackLink href="/products">Back to products</BackLink>
        <Card>
          <Layout>
            <ImageGrid>
              {images.map((image) => (
                <Image key={image} src={image} alt={product.name} />
              ))}
            </ImageGrid>
            <div>
              <Title>{product.name}</Title>
              <Meta>Code: {product.code}</Meta>
              <Price>{formatPrice(product.price)}</Price>
              <Description>{product.description || "No description provided."}</Description>
            </div>
          </Layout>
        </Card>
      </Shell>
    </Page>
  );
}
