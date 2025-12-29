"use client";

import styled from "styled-components";

const Field = styled.label`
  display: block;
  position: relative;
`;

const LabelText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Icon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--muted, #b6aea6);
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px 0 44px;
  border-radius: 12px;
  border: 1px solid var(--border-soft, #e1ddd6);
  background: var(--surface, #ffffff);
  font-size: 14px;
  color: var(--ink, #2c2925);
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 12px 30px rgba(20, 20, 20, 0.05);

  &:focus {
    border-color: var(--accent-soft, #d4b08a);
    box-shadow: 0 0 0 3px rgba(212, 176, 138, 0.25);
  }

  &::placeholder {
    color: var(--muted, #b6aea6);
  }
`;

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search products",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Field>
      <LabelText>Search products</LabelText>
      <Icon aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Icon>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}
