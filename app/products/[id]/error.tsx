"use client";

import Link from "next/link";
import styled from "styled-components";

const Page = styled.main`
  min-height: 100vh;
  padding: 56px 24px 96px;
  background: #f7f7f4;
  display: grid;
  place-items: center;
`;

const Card = styled.section`
  max-width: 420px;
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid rgba(27, 26, 23, 0.08);
  text-align: center;
  display: grid;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b645d;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  background: #1b1a17;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;

const LinkButton = styled(Link)`
  border: 1px solid rgba(27, 26, 23, 0.12);
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 600;
  text-decoration: none;
  color: #1b1a17;
`;

export default function ProductDetailError({ reset }: { reset: () => void }) {
  return (
    <Page>
      <Card>
        <Title>Something went wrong</Title>
        <Text>We could not load this product. Please try again.</Text>
        <Actions>
          <Button onClick={() => reset()}>Try again</Button>
          <LinkButton href="/products">Back to Products</LinkButton>
        </Actions>
      </Card>
    </Page>
  );
}
