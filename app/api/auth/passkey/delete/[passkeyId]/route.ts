import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ passkeyId: string }> }
) {
  try {
    const { passkeyId } = await params;

    if (!passkeyId) {
      return NextResponse.json(
        { error: "Passkey ID is required" },
        { status: 400 }
      );
    }

    await auth.api.deletePasskey({
      headers: await headers(),
      body: {
        id: passkeyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete passkey" },
      { status: 500 }
    );
  }
}
