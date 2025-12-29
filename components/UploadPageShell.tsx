"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import ProductForm from "@/components/ProductForm";
import { AUTH_KEY } from "@/lib/auth";

const Page = styled.main`
  min-height: 100vh;
  padding: 48px 24px 80px;
  background: #f4f3f1;
`;

const Shell = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Card = styled.section`
  background: #ffffff;
  border-radius: 18px;
  padding: 36px 60px 52px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);

  @media (max-width: 720px) {
    padding: 28px 24px 40px;
  }
`;

const CardContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
  display: grid;
  gap: 18px;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(22px, 2.6vw, 28px);
`;

const Subtitle = styled.p`
  margin: 0;
  color: #7a736c;
  font-size: 13px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActionLink = styled(Link)`
  height: 36px;
  display: inline-flex;
  align-items: center;
  padding: 0 18px;
  border-radius: 999px;
  background: #1b1a17;
  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  text-decoration: none;
`;

const SecondaryLink = styled(ActionLink)`
  background: #ffffff;
  color: #1b1a17;
  border: 1px solid #e4e1dc;
`;

const LogoutButton = styled.button`
  border: none;
  background: transparent;
  color: #0f5d55;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  justify-self: start;
`;

const NoticeCard = styled(Card)`
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
`;

export default function UploadPageShell() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(AUTH_KEY);
    setIsAuthed(stored === "true");
  }, []);

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
  };

  return (
    <Page>
      <Shell>
        {isAuthed ? (
          <Card>
            <CardContent>
              <HeaderRow>
                <Title>Upload Product</Title>
                <Actions>
                  <SecondaryLink href="/admin">Back to menu</SecondaryLink>
                  <ActionLink href="/products">Go to products</ActionLink>
                </Actions>
              </HeaderRow>
              <Subtitle>Fill in product details and upload images.</Subtitle>
              <ProductForm />
              <LogoutButton onClick={handleLogout}>Log out</LogoutButton>
            </CardContent>
          </Card>
        ) : (
          <NoticeCard>
            <CardContent>
              <Title>Sign in required</Title>
              <Subtitle>Login to access the upload form.</Subtitle>
              <Actions style={{ justifyContent: "center" }}>
                <ActionLink href="/login">Go to login</ActionLink>
              </Actions>
            </CardContent>
          </NoticeCard>
        )}
      </Shell>
    </Page>
  );
}
