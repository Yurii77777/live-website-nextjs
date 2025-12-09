import { NextRequest, NextResponse } from "next/server";
import { pageService } from "@/services/page.service";
import { createEmptyLocalizedContent } from "@/helpers/localized-content";

export async function GET() {
  try {
    const pages = await pageService.findAll();
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, title } = await req.json();

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 }
      );
    }

    const existingPage = await pageService.findBySlug(slug);

    if (existingPage) {
      return NextResponse.json(
        { error: "Page with this slug already exists" },
        { status: 409 }
      );
    }

    const page = await pageService.create({
      slug,
      title,
      content: createEmptyLocalizedContent(),
      published: false,
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
