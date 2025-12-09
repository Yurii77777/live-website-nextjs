import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";

export async function GET() {
  try {
    const hasUsers = await userService.hasUsers();
    return NextResponse.json({ hasUsers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check users" },
      { status: 500 }
    );
  }
}
