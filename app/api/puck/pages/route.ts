import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all pages
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// POST create new page
export async function POST(req: NextRequest) {
  try {
    const { slug, title } = await req.json();

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Page with this slug already exists" },
        { status: 409 }
      );
    }

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        content: { content: [], root: {} },
        published: false,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to create page:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
