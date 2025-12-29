"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import ProductsClient from "@/components/ProductsClient";
import { AUTH_KEY } from "@/lib/auth";

const Page = styled.main`
  --page-bg: #f7f7f4;
  --surface: #ffffff;
  --ink: #2c2925;
  --muted: #9c948b;
  --border-soft: #e1ddd6;
  --border-strong: rgba(27, 26, 23, 0.08);
  --accent: #e0483a;
  --accent-soft: #d4b08a;
  --shadow-soft: 0 12px 28px rgba(23, 21, 18, 0.08);
  --shadow-strong: 0 16px 36px rgba(23, 21, 18, 0.12);

  min-height: 100vh;
  padding: 56px 24px 96px;
  background:
    radial-gradient(520px 320px at 4% 4%, rgba(252, 232, 207, 0.7), transparent 70%),
    radial-gradient(480px 320px at 96% 0%, rgba(238, 232, 222, 0.9), transparent 70%),
    var(--page-bg);
  color: var(--ink);
`;

const Shell = styled.div`
  max-width: 1020px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 600;
`;

const BackLink = styled(Link)`
  height: 36px;
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(27, 26, 23, 0.16);
  text-decoration: none;
  color: #1b1a17;
  font-weight: 600;
  font-size: 12px;
`;

export default function ProductsPageShell() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(AUTH_KEY);
    setIsAuthed(stored === "true");
  }, []);

  return (
    <Page>
      <Shell>
        <Header>
          <HeaderRow>
            <Title>Product list</Title>
            {isAuthed ? <BackLink href="/admin">Back to menu</BackLink> : null}
          </HeaderRow>
        </Header>

        <ProductsClient />
      </Shell>
    </Page>
  );
}
