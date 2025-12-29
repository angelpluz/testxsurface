import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const featuredParam = searchParams.get("featured");
    const dealParam = searchParams.get("deal");
    const limitParam = searchParams.get("limit");
    const isFeatured = featuredParam === "1" || featuredParam === "true";
    const isDeal = dealParam === "1" || dealParam === "true";

    const filter: Record<string, unknown> = {};
    if (isFeatured) {
      filter.isFeatured = true;
    }
    if (isDeal) {
      filter.dealPercent = { $gt: 0 };
    }
    if (search) {
      const trimmed = search.trim();
      if (trimmed) {
        const regex = new RegExp(escapeRegex(trimmed), "i");
        filter.$or = [{ name: regex }, { code: regex }];
      }
    }

    const query = Product.find(filter).lean();
    if (isDeal) {
      query.sort({ dealPercent: -1, createdAt: -1 });
    } else if (isFeatured) {
      query.sort({ featuredOrder: 1, createdAt: -1 });
    } else {
      query.sort({ createdAt: -1 });
    }

    if (limitParam) {
      const limit = Number(limitParam);
      if (Number.isFinite(limit) && limit > 0) {
        query.limit(limit);
      }
    }

    const products = await query;
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const payload = (await request.json()) as {
      name?: string;
      code?: string;
      price?: number | string;
      description?: string;
      images?: string[];
      imageUrl?: string;
      isFeatured?: boolean;
      featuredOrder?: number | string;
      dealPercent?: number | string;
      inStock?: boolean;
    };

    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const code = typeof payload.code === "string" ? payload.code.trim() : "";
    const description = typeof payload.description === "string" ? payload.description.trim() : undefined;

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required.";
    if (!code) errors.code = "Code is required.";

    let price: number | undefined;
    if (payload.price !== undefined && payload.price !== "") {
      const parsed = Number(payload.price);
      if (!Number.isFinite(parsed)) {
        errors.price = "Price must be a valid number.";
      } else if (parsed < 0) {
        errors.price = "Price must be zero or positive.";
      } else {
        price = parsed;
      }
    }

    const isFeatured = Boolean(payload.isFeatured);
    const inStock = payload.inStock !== undefined ? Boolean(payload.inStock) : true;
    let featuredOrder: number | undefined;
    if (payload.featuredOrder !== undefined && payload.featuredOrder !== "") {
      const parsed = Number(payload.featuredOrder);
      if (!Number.isFinite(parsed)) {
        errors.featuredOrder = "Featured order must be a valid number.";
      } else if (parsed < 0) {
        errors.featuredOrder = "Featured order must be zero or positive.";
      } else {
        featuredOrder = parsed;
      }
    }

    let dealPercent: number | undefined;
    if (payload.dealPercent !== undefined && payload.dealPercent !== "") {
      const parsed = Number(payload.dealPercent);
      if (!Number.isFinite(parsed)) {
        errors.dealPercent = "Deal percent must be a valid number.";
      } else if (parsed < 0 || parsed > 100) {
        errors.dealPercent = "Deal percent must be between 0 and 100.";
      } else {
        dealPercent = parsed;
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed.", fields: errors }, { status: 400 });
    }

    const images: string[] = [];
    if (Array.isArray(payload.images)) {
      images.push(...payload.images.filter((url) => typeof url === "string" && url.trim().length > 0));
    }
    if (typeof payload.imageUrl === "string" && payload.imageUrl.trim()) {
      images.push(payload.imageUrl.trim());
    }

    const created = await Product.create({
      name,
      code,
      price,
      description,
      images: images.length > 0 ? images : undefined,
      isFeatured,
      featuredOrder: isFeatured ? featuredOrder ?? 0 : undefined,
      dealPercent,
      inStock,
    });

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "Code must be unique." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
