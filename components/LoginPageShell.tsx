"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { ADMIN_PASS, ADMIN_USER, AUTH_KEY } from "@/lib/auth";

const Page = styled.main`
  min-height: 100vh;
  padding: 56px 24px 80px;
  background:
    radial-gradient(520px 320px at 8% 6%, rgba(252, 232, 207, 0.7), transparent 70%),
    radial-gradient(520px 320px at 96% 10%, rgba(238, 232, 222, 0.9), transparent 70%),
    #f7f7f4;
`;

const Shell = styled.div`
  max-width: 520px;
  margin: 0 auto;
`;

const Card = styled.section`
  background: #ffffff;
  border-radius: 20px;
  padding: 36px 40px 40px;
  border: 1px solid rgba(27, 26, 23, 0.08);
  box-shadow: 0 16px 40px rgba(23, 21, 18, 0.12);
  display: grid;
  gap: 16px;

  @media (max-width: 640px) {
    padding: 28px 24px 32px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(22px, 3vw, 28px);
`;

const Subtitle = styled.p`
  margin: 0;
  color: #7a736c;
  font-size: 13px;
`;

const Form = styled.form`
  display: grid;
  gap: 14px;
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
  font-size: 13px;
  color: #5a524b;
`;

const Input = styled.input`
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid #e4e1dc;
  background: #ffffff;
  font-size: 14px;
  color: #1b1a17;
  outline: none;

  &:focus {
    border-color: #d9d4cc;
    box-shadow: 0 0 0 3px rgba(231, 64, 49, 0.12);
  }
`;

const PrimaryButton = styled.button`
  height: 42px;
  padding: 0 24px;
  border: none;
  border-radius: 999px;
  background: #1b1a17;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;

const HelperText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #6a615a;
  text-align: center;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #b42318;
  font-weight: 600;
`;

const GhostLink = styled(Link)`
  justify-self: center;
  font-size: 12px;
  color: #5a524b;
  text-decoration: none;
`;

export default function LoginPageShell() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(AUTH_KEY);
    if (stored === "true") {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      window.sessionStorage.setItem(AUTH_KEY, "true");
      setUsername("");
      setPassword("");
      router.push("/admin");
      return;
    }

    setError("Invalid admin credentials.");
  };

  return (
    <Page>
      <Shell>
        <Card>
          <Title>Sign in</Title>
          <Subtitle>Use the admin account to access the upload tools.</Subtitle>
          <Form onSubmit={handleLogin}>
            <Field>
              Admin username
              <Input value={username} onChange={(event) => setUsername(event.target.value)} required />
            </Field>
            <Field>
              Password
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
            {error ? <ErrorText>{error}</ErrorText> : null}
            <PrimaryButton type="submit">Log in</PrimaryButton>
            <HelperText>Demo admin: admin / admin123</HelperText>
          </Form>
          <GhostLink href="/">Back to landing</GhostLink>
        </Card>
      </Shell>
    </Page>
  );
}
