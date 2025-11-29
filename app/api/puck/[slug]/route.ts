import { NextRequest, NextResponse } from "next/server";
import { pageService } from "@/services/db/page.service";
import { PROTECTED_PAGES } from "@/constants/pages";
import { createEmptyLocalizedContent } from "@/helpers/localized-content";
import { PuckParams } from "@/app/api/types/puck.types";

export async function GET(req: NextRequest, { params }: PuckParams) {
  try {
    const { slug } = await params;

    const page = await pageService.findBySlug(slug);

    if (!page || !page.content) {
      return NextResponse.json(createEmptyLocalizedContent());
    }

    return NextResponse.json(page.content);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: PuckParams) {
  try {
    const { slug } = await params;
    const data = await req.json();

    const page = await pageService.upsert(slug, {
      content: data,
      published: true,
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: PuckParams) {
  try {
    const { slug } = await params;

    if (PROTECTED_PAGES.includes(slug as any)) {
      return NextResponse.json(
        { error: "Cannot delete protected page" },
        { status: 403 }
      );
    }

    await pageService.delete(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
