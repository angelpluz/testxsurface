import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ order: 1, name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load categories." }, { status: 500 });
  }
}
