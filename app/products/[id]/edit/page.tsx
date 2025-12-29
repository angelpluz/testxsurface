"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";

import { AUTH_KEY } from "@/lib/auth";
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
  max-width: 920px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
`;

const Card = styled.section`
  background: #ffffff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid rgba(27, 26, 23, 0.08);
  box-shadow: 0 16px 40px rgba(23, 21, 18, 0.08);
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
  font-size: clamp(22px, 3vw, 30px);
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b645d;
  font-size: 13px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const GhostLink = styled(Link)`
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

const PrimaryButton = styled.button`
  height: 36px;
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 999px;
  border: none;
  background: #1b1a17;
  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
`;

const Form = styled.form`
  display: grid;
  gap: 18px;
`;

const Label = styled.label`
  display: grid;
  gap: 8px;
  font-size: 12px;
  color: #6b645d;
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

const Textarea = styled.textarea`
  min-height: 120px;
  padding: 12px 16px;
  border-radius: 18px;
  border: 1px solid #e4e1dc;
  background: #ffffff;
  font-size: 14px;
  color: #1b1a17;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #d9d4cc;
    box-shadow: 0 0 0 3px rgba(231, 64, 49, 0.12);
  }
`;

const InlineRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  align-items: center;
`;

const Preview = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(27, 26, 23, 0.08);
  background: #ffffff;
  padding: 10px;
  display: grid;
  gap: 8px;
`;

const PreviewLabel = styled.span`
  font-size: 12px;
  color: #6b645d;
`;

const PreviewImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  object-fit: cover;
  background: #efe7dd;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #6b645d;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #e74031;
`;

const Status = styled.div<{ $variant: "success" | "error" }>`
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $variant }) => ($variant === "success" ? "#0f5d55" : "#b42318")};
  background: ${({ $variant }) =>
    $variant === "success" ? "rgba(15, 93, 85, 0.12)" : "rgba(180, 35, 24, 0.12)"};
`;

type FieldState = {
  name: string;
  code: string;
  price: string;
  imageUrl: string;
  description: string;
  isFeatured: boolean;
  featuredOrder: string;
  dealPercent: string;
  inStock: boolean;
};

const emptyState: FieldState = {
  name: "",
  code: "",
  price: "",
  imageUrl: "",
  description: "",
  isFeatured: false,
  featuredOrder: "",
  dealPercent: "",
  inStock: true,
};

const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23efe7dd'/%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='url(%23grid)'/%3E%3Cdefs%3E%3Cpattern id='grid' width='12' height='12' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 0h12v12H0z' fill='%23efe7dd'/%3E%3Cpath d='M0 0h12M0 0v12' stroke='%23e1d7c8' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3C/svg%3E";

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = useMemo(() => {
    const value = params?.id;
    return Array.isArray(value) ? value[0] : value;
  }, [params]);

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fields, setFields] = useState<FieldState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const previewSrc = fields.imageUrl.trim() || placeholderImage;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(AUTH_KEY);
    if (stored !== "true") {
      router.replace("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (checkingAuth || !productId) return;
    const controller = new AbortController();
    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}`, { signal: controller.signal });
        if (response.status === 404) {
          setStatus({ type: "error", message: "Product not found." });
          return;
        }
        if (!response.ok) {
          throw new Error("Unable to load product.");
        }
        const data = (await response.json()) as { product: Product };
        const product = data.product;
        setFields({
          name: product.name ?? "",
          code: product.code ?? "",
          price: product.price !== undefined ? String(product.price) : "",
          imageUrl: product.images?.[0] ?? "",
          description: product.description ?? "",
          isFeatured: Boolean(product.isFeatured),
          featuredOrder:
            product.isFeatured && product.featuredOrder !== undefined ? String(product.featuredOrder) : "",
          dealPercent: product.dealPercent !== undefined ? String(product.dealPercent) : "",
          inStock: product.inStock !== false,
        });
        setStatus(null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus({ type: "error", message: "Unable to load product." });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    return () => controller.abort();
  }, [checkingAuth, productId]);

  const updateField = (key: keyof FieldState, value: string | boolean) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    if (!productId) return;

    setSaving(true);
    try {
      const payload = {
        name: fields.name.trim(),
        code: fields.code.trim(),
        price: fields.price.trim() ? Number(fields.price) : undefined,
        imageUrl: fields.imageUrl.trim() || undefined,
        description: fields.description.trim() || undefined,
        isFeatured: fields.isFeatured,
        featuredOrder: fields.isFeatured && fields.featuredOrder.trim() ? Number(fields.featuredOrder) : undefined,
        dealPercent: fields.dealPercent.trim() ? Number(fields.dealPercent) : undefined,
        inStock: fields.inStock,
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Unable to update product.");
      }

      setStatus({ type: "success", message: "Product updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unexpected error." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Shell>
        <Card>
          <HeaderRow>
            <div>
              <Title>Edit product</Title>
              <Subtitle>Update the product details in the catalog.</Subtitle>
            </div>
            <Actions>
              <GhostLink href="/products">Back to Products</GhostLink>
              <PrimaryButton type="submit" form="edit-form" disabled={saving || loading}>
                {saving ? "Saving..." : "Save"}
              </PrimaryButton>
            </Actions>
          </HeaderRow>

          {checkingAuth ? <Subtitle>Checking access...</Subtitle> : null}
          {loading && !checkingAuth ? <Subtitle>Loading product...</Subtitle> : null}

          {!loading && !checkingAuth ? (
            <Form id="edit-form" onSubmit={handleSubmit}>
              <Label>
                Product name
                <Input
                  value={fields.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Product name"
                  required
                />
              </Label>
              <Label>
                Code
                <Input
                  value={fields.code}
                  onChange={(event) => updateField("code", event.target.value)}
                  placeholder="Code"
                  required
                />
              </Label>
              <InlineRow>
                <Label>
                  Price
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fields.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    placeholder="฿1,000"
                  />
                </Label>
                <Label>
                  Image URL
                  <Input
                    value={fields.imageUrl}
                    onChange={(event) => updateField("imageUrl", event.target.value)}
                    placeholder="https://..."
                  />
                </Label>
              </InlineRow>
              <Preview>
                <PreviewLabel>Image preview</PreviewLabel>
                <PreviewImage src={previewSrc} alt={fields.name || "Product image preview"} />
              </Preview>
              <Label>
                Description
                <Textarea
                  value={fields.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Product description"
                />
              </Label>
              <InlineRow>
                <CheckboxRow>
                  <Checkbox
                    type="checkbox"
                    checked={fields.isFeatured}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      updateField("isFeatured", checked);
                      if (!checked) updateField("featuredOrder", "");
                    }}
                  />
                  Mark as popular / recommended
                </CheckboxRow>
                <Label>
                  Featured order
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={fields.featuredOrder}
                    onChange={(event) => updateField("featuredOrder", event.target.value)}
                    placeholder="1"
                    disabled={!fields.isFeatured}
                  />
                </Label>
              </InlineRow>
              <InlineRow>
                <Label>
                  Deal discount (%)
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={fields.dealPercent}
                    onChange={(event) => updateField("dealPercent", event.target.value)}
                    placeholder="50"
                  />
                </Label>
                <CheckboxRow>
                  <Checkbox
                    type="checkbox"
                    checked={fields.inStock}
                    onChange={(event) => updateField("inStock", event.target.checked)}
                  />
                  In stock
                </CheckboxRow>
              </InlineRow>

              {status ? <Status $variant={status.type}>{status.message}</Status> : null}
            </Form>
          ) : null}
        </Card>
      </Shell>
    </Page>
  );
}
