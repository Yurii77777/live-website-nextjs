import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { PuckParams } from "@/app/api/types/puck.types";

export async function GET(req: NextRequest, { params }: PuckParams) {
  try {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      // Return empty data if the page doesn't exist
      return NextResponse.json({
        content: [],
        root: {},
      });
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

    // Upsert: create a new or update an existing page
    const page = await prisma.page.upsert({
      where: { slug },
      update: {
        content: data,
        updatedAt: new Date(),
      },
      create: {
        slug,
        title: `${slug} configuration`,
        content: data,
        published: true,
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: PuckParams) {
  try {
    const { slug } = await params;

    await prisma.page.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
