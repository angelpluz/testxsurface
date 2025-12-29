"use client";

import { createGlobalStyle } from "styled-components";

const BaseStyles = createGlobalStyle`
  :root {
    color-scheme: light;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: var(--font-sans), system-ui, sans-serif;
    background: #f5f0e7;
    color: #1b1a17;
    line-height: 1.6;
    text-rendering: optimizeLegibility;
  }

  a {
    color: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }
`;

export default function GlobalStyle() {
  return <BaseStyles />;
}
