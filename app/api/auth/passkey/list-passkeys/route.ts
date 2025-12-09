import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const passkeys = await auth.api.listPasskeys({
      headers: await headers(),
    });

    return NextResponse.json(passkeys);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list passkeys" },
      { status: 500 }
    );
  }
}
