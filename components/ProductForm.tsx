"use client";

import { useEffect, useRef, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: grid;
  gap: 22px;
  max-width: 640px;
  margin: 0 auto;
`;

const FieldGroup = styled.div`
  display: grid;
  gap: 16px;
`;

const Label = styled.label`
  display: grid;
  gap: 8px;
  font-size: 12px;
  color: #6b645d;
  width: 100%;
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

  &:disabled {
    background: #f5f3ef;
    color: #9c948b;
  }
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

const InlineRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  align-items: center;
`;

const Dropzone = styled.div<{ $dragging?: boolean }>`
  border: 1px dashed ${({ $dragging }) => ($dragging ? "#e74031" : "#d8d4cf")};
  border-radius: 18px;
  min-height: 220px;
  padding: 22px;
  display: grid;
  place-items: center;
  text-align: center;
  color: #6b645d;
  background: ${({ $dragging }) => ($dragging ? "rgba(231, 64, 49, 0.05)" : "#ffffff")};
  position: relative;
  cursor: pointer;
`;

const UploadIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid #e6e2dc;
  display: grid;
  place-items: center;
  margin: 0 auto 10px;

  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-left: 2px solid #7c756e;
    border-bottom: 2px solid #7c756e;
    transform: rotate(135deg);
    margin-top: 2px;
  }
`;

const UploadText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #5f5953;
`;

const UploadNote = styled.p`
  margin: 6px 0 0;
  font-size: 11px;
  color: #a39d97;
`;

const UploadLink = styled.button`
  border: none;
  background: transparent;
  color: #2f6bed;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
`;

const UploadFooter = styled.div`
  position: absolute;
  right: 18px;
  bottom: 12px;
  font-size: 11px;
  color: #a39d97;
  z-index: 2;
`;

const PreviewImage = styled.img`
  position: absolute;
  inset: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  object-fit: cover;
  border-radius: 14px;
  z-index: 1;
`;

const PreviewBadge = styled.span`
  position: absolute;
  left: 16px;
  bottom: 16px;
  font-size: 11px;
  font-weight: 600;
  color: #1b1a17;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 999px;
  z-index: 2;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Divider = styled.div`
  height: 1px;
  background: #f0eee9;
  margin-top: -6px;
`;

const ErrorText = styled.span`
  color: #b42318;
  font-size: 12px;
  font-weight: 600;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 10px;
`;

const CancelButton = styled.button`
  min-width: 140px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid #e4e1dc;
  background: #ffffff;
  color: #e74031;
  font-weight: 600;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  min-width: 140px;
  height: 42px;
  border-radius: 999px;
  border: none;
  background: #e74031;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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
  isFeatured: boolean;
  featuredOrder: string;
  dealPercent: string;
  inStock: boolean;
};

const initialState: FieldState = {
  name: "",
  code: "",
  price: "",
  imageUrl: "",
  isFeatured: false,
  featuredOrder: "",
  dealPercent: "",
  inStock: true,
};

export default function ProductForm() {
  const [fields, setFields] = useState<FieldState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateField = (key: keyof FieldState, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!fields.name.trim()) nextErrors.name = "Product name is required.";
    if (!fields.code.trim()) nextErrors.code = "Code is required.";
    if (fields.price.trim()) {
      const parsed = Number(fields.price);
      if (!Number.isFinite(parsed)) {
        nextErrors.price = "Price must be numeric.";
      } else if (parsed < 0) {
        nextErrors.price = "Price must be zero or positive.";
      }
    }
    if (fields.featuredOrder.trim()) {
      const parsed = Number(fields.featuredOrder);
      if (!Number.isFinite(parsed)) {
        nextErrors.featuredOrder = "Featured order must be numeric.";
      } else if (parsed < 0) {
        nextErrors.featuredOrder = "Featured order must be zero or positive.";
      }
    }
    if (fields.dealPercent.trim()) {
      const parsed = Number(fields.dealPercent);
      if (!Number.isFinite(parsed)) {
        nextErrors.dealPercent = "Deal percent must be numeric.";
      } else if (parsed < 0 || parsed > 100) {
        nextErrors.dealPercent = "Deal percent must be between 0 and 100.";
      }
    }
    return nextErrors;
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelected = (file?: File) => {
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
  };

  const handlePickClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFileSelected(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setLoading(true);
    try {
      const featuredOrder = fields.featuredOrder.trim()
        ? Number(fields.featuredOrder)
        : undefined;
      const dealPercent = fields.dealPercent.trim()
        ? Number(fields.dealPercent)
        : undefined;
      const payload = {
        name: fields.name.trim(),
        code: fields.code.trim(),
        price: fields.price.trim() ? Number(fields.price) : undefined,
        imageUrl: fields.imageUrl.trim() || undefined,
        isFeatured: fields.isFeatured,
        featuredOrder: fields.isFeatured ? featuredOrder : undefined,
        dealPercent,
        inStock: fields.inStock,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Unable to create product.");
      }

      setFields(initialState);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setErrors({});
      setStatus({ type: "success", message: "Product created successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Unexpected error." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFields(initialState);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setErrors({});
    setStatus(null);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Upload image
        <Dropzone
          $dragging={isDragging}
          onClick={handlePickClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <>
              <PreviewImage src={previewUrl} alt="Preview" />
              <PreviewBadge>Preview only</PreviewBadge>
            </>
          ) : (
            <div>
              <UploadIcon />
              <UploadText>
                Drag & Drop or{" "}
                <UploadLink
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handlePickClick();
                  }}
                >
                  Choose file
                </UploadLink>{" "}
                to upload
              </UploadText>
              <UploadNote>Preview only (not uploaded). JPG or PNG, max 50MB.</UploadNote>
            </div>
          )}
          <UploadFooter>Preview ({previewUrl ? "1" : "0"})</UploadFooter>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => {
              handleFileSelected(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </Dropzone>
      </Label>

      <Label>
        Image URL
        <Input
          value={fields.imageUrl}
          onChange={(event) => updateField("imageUrl", event.target.value)}
          placeholder="https://..."
        />
      </Label>

      <Divider />

      <FieldGroup>
        <Label>
          Product name
          <Input
            value={fields.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Product name"
            required
          />
          {errors.name ? <ErrorText>{errors.name}</ErrorText> : null}
        </Label>
        <Label>
          Code
          <Input
            value={fields.code}
            onChange={(event) => updateField("code", event.target.value)}
            placeholder="Code"
            required
          />
          {errors.code ? <ErrorText>{errors.code}</ErrorText> : null}
        </Label>
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
          {errors.price ? <ErrorText>{errors.price}</ErrorText> : null}
        </Label>
        <InlineRow>
          <CheckboxRow>
            <Checkbox
              type="checkbox"
              checked={fields.isFeatured}
              onChange={(event) =>
                setFields((prev) => ({
                  ...prev,
                  isFeatured: event.target.checked,
                  featuredOrder: event.target.checked ? prev.featuredOrder : "",
                }))
              }
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
            {errors.featuredOrder ? <ErrorText>{errors.featuredOrder}</ErrorText> : null}
          </Label>
        </InlineRow>
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
          {errors.dealPercent ? <ErrorText>{errors.dealPercent}</ErrorText> : null}
        </Label>
        <CheckboxRow>
          <Checkbox
            type="checkbox"
            checked={fields.inStock}
            onChange={(event) => setFields((prev) => ({ ...prev, inStock: event.target.checked }))}
          />
          In stock
        </CheckboxRow>
      </FieldGroup>

      <ButtonRow>
        <CancelButton type="button" onClick={handleCancel}>
          {"ยกเลิก"}
        </CancelButton>
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Saving..." : "ยืนยัน"}
        </SubmitButton>
      </ButtonRow>

      {status ? <Status $variant={status.type}>{status.message}</Status> : null}
    </Form>
  );
}
