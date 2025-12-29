"use client";

import { useState } from "react";
import styled from "styled-components";

const Button = styled.button`
  border: 1px solid rgba(27, 26, 23, 0.12);
  background: #ffffff;
  color: #1b1a17;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
`;

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  };

  return <Button onClick={handleCopy}>{copied ? "Copied" : "Copy code"}</Button>;
}
