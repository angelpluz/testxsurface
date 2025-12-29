"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import { AUTH_KEY } from "@/lib/auth";

const Page = styled.main`
  min-height: 100vh;
  padding: 56px 24px 96px;
  background:
    radial-gradient(520px 320px at 6% 0%, rgba(252, 232, 207, 0.7), transparent 70%),
    radial-gradient(520px 320px at 96% 0%, rgba(238, 232, 222, 0.9), transparent 70%),
    #f7f7f4;
`;

const Shell = styled.div`
  max-width: 760px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
`;

const Header = styled.header`
  display: grid;
  gap: 8px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(22px, 3vw, 30px);
`;

const Subtitle = styled.p`
  margin: 0;
  color: #7a736c;
  font-size: 13px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const CardLink = styled(Link)`
  border-radius: 18px;
  padding: 22px;
  background: #ffffff;
  border: 1px solid rgba(27, 26, 23, 0.08);
  box-shadow: 0 12px 28px rgba(23, 21, 18, 0.08);
  text-decoration: none;
  color: #1b1a17;
  display: grid;
  gap: 8px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgba(23, 21, 18, 0.12);
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 16px;
`;

const CardText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #7a736c;
`;

const LoginCard = styled.section`
  border-radius: 18px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid rgba(27, 26, 23, 0.08);
  box-shadow: 0 12px 28px rgba(23, 21, 18, 0.08);
  display: grid;
  gap: 12px;
  text-align: center;
`;

const LoginLink = styled(Link)`
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  border-radius: 999px;
  background: #1b1a17;
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
`;

export default function AdminHubPageShell() {
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
          <Title>Admin hub</Title>
          <Subtitle>Choose where you want to go next.</Subtitle>
        </Header>

        {isAuthed ? (
          <Grid>
            <CardLink href="/upload">
              <CardTitle>Upload product</CardTitle>
              <CardText>Create a new product entry and attach images.</CardText>
            </CardLink>
            <CardLink href="/products">
              <CardTitle>Product list</CardTitle>
              <CardText>Browse, search, and check the current catalog.</CardText>
            </CardLink>
          </Grid>
        ) : (
          <LoginCard>
            <Title>Sign in required</Title>
            <Subtitle>Please sign in to access admin tools.</Subtitle>
            <LoginLink href="/login">Go to login</LoginLink>
          </LoginCard>
        )}
      </Shell>
    </Page>
  );
}
