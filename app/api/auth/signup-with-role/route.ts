import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { UserRole } from "@/types/auth";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Check if this will be the first user
    const userCount = await db.select().from(user).limit(1);
    const isFirstUser = userCount.length === 0;

    // Use better-auth to create user and account (handles password hashing)
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });

    if (!signUpResult) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // If this is the first user, update their role to ADMIN
    if (isFirstUser) {
      await db
        .update(user)
        .set({ role: UserRole.ADMIN, updatedAt: new Date() })
        .where(eq(user.email, email));

      console.log(`✅ First user created with admin role: ${email}`);
    }

    return NextResponse.json({
      user: signUpResult.user,
      token: signUpResult.token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
