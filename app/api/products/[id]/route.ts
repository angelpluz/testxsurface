import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

    await connectToDatabase();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load product." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

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

    const errors: Record<string, string> = {};
    const updates: Record<string, unknown> = {};

    if (payload.name !== undefined) {
      const name = typeof payload.name === "string" ? payload.name.trim() : "";
      if (!name) errors.name = "Name is required.";
      else updates.name = name;
    }

    if (payload.code !== undefined) {
      const code = typeof payload.code === "string" ? payload.code.trim().toUpperCase() : "";
      if (!code) errors.code = "Code is required.";
      else updates.code = code;
    }

    if (payload.price !== undefined && payload.price !== "") {
      const parsed = Number(payload.price);
      if (!Number.isFinite(parsed)) {
        errors.price = "Price must be a valid number.";
      } else if (parsed < 0) {
        errors.price = "Price must be zero or positive.";
      } else {
        updates.price = parsed;
      }
    }

    if (payload.description !== undefined) {
      const description = typeof payload.description === "string" ? payload.description.trim() : "";
      updates.description = description || undefined;
    }

    if (payload.imageUrl !== undefined) {
      const imageUrl = typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "";
      updates.images = imageUrl ? [imageUrl] : [];
    } else if (Array.isArray(payload.images)) {
      updates.images = payload.images.filter((url) => typeof url === "string" && url.trim().length > 0);
    }

    if (payload.isFeatured !== undefined) {
      updates.isFeatured = Boolean(payload.isFeatured);
    }

    if (payload.featuredOrder !== undefined && payload.featuredOrder !== "") {
      const parsed = Number(payload.featuredOrder);
      if (!Number.isFinite(parsed)) {
        errors.featuredOrder = "Featured order must be a valid number.";
      } else if (parsed < 0) {
        errors.featuredOrder = "Featured order must be zero or positive.";
      } else {
        updates.featuredOrder = parsed;
      }
    }

    if (payload.dealPercent !== undefined && payload.dealPercent !== "") {
      const parsed = Number(payload.dealPercent);
      if (!Number.isFinite(parsed)) {
        errors.dealPercent = "Deal percent must be a valid number.";
      } else if (parsed < 0 || parsed > 100) {
        errors.dealPercent = "Deal percent must be between 0 and 100.";
      } else {
        updates.dealPercent = parsed;
      }
    }

    if (payload.inStock !== undefined) {
      updates.inStock = Boolean(payload.inStock);
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed.", fields: errors }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product: updated });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "Code must be unique." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}
