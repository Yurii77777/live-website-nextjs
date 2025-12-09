import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { db } from "@/lib/db";
import { user, account, type User } from "@/lib/db/schema";
import {
  SALT_ROUNDS,
  PASSWORD_SECURITY,
  ID_GENERATION,
  CREDENTIAL_PROVIDER_ID,
  USER_QUERY_LIMITS,
} from "@/constants/auth";

/**
 * Get password pepper from environment
 * @throws Error if PASSWORD_PEPPER is not set
 */
function getPasswordPepper(): string {
  const pepper = process.env.PASSWORD_PEPPER;

  if (!pepper) {
    throw new Error(
      "PASSWORD_PEPPER environment variable is not set. Please set it in your .env file."
    );
  }

  return pepper;
}

/**
 * Apply HMAC-SHA256 pepper to password
 * This adds an additional layer of security beyond bcrypt's salt
 */
function applyPepper(password: string): string {
  const pepper = getPasswordPepper();
  return crypto
    .createHmac(PASSWORD_SECURITY.HASH_ALGORITHM, pepper)
    .update(password)
    .digest("hex");
}

/**
 * Hash password using HMAC-SHA256 pepper + bcrypt
 * Following OWASP recommendations for defense-in-depth password security
 */
async function hashPassword(password: string): Promise<string> {
  const pepperedPassword = applyPepper(password);
  return bcrypt.hash(pepperedPassword, SALT_ROUNDS);
}

/**
 * Verify password against hash
 */
async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const pepperedPassword = applyPepper(password);
  return bcrypt.compare(pepperedPassword, hash);
}

/**
 * Generate unique user ID
 */
function generateUserId(): string {
  return `u${Date.now().toString(ID_GENERATION.BASE)}${Math.random()
    .toString(ID_GENERATION.BASE)
    .substring(ID_GENERATION.RANDOM_START, ID_GENERATION.RANDOM_END)}`;
}

/**
 * Generate unique account ID
 */
function generateAccountId(): string {
  return `a${Date.now().toString(ID_GENERATION.BASE)}${Math.random()
    .toString(ID_GENERATION.BASE)
    .substring(ID_GENERATION.RANDOM_START, ID_GENERATION.RANDOM_END)}`;
}

export const userService = {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    return foundUser;
  },

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | undefined> {
    const [foundUser] = await db.select().from(user).where(eq(user.id, id));
    return foundUser;
  },

  /**
   * Create user with email/password credentials
   */
  async createWithPassword(data: {
    email: string;
    name: string;
    password: string;
    emailVerified?: boolean;
  }): Promise<User> {
    const now = new Date();
    const userId = generateUserId();
    const accountId = generateAccountId();

    // Create user
    const [createdUser] = await db
      .insert(user)
      .values({
        id: userId,
        email: data.email,
        name: data.name,
        emailVerified: data.emailVerified ?? false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Create account with password
    const hashedPassword = await hashPassword(data.password);
    await db.insert(account).values({
      id: accountId,
      accountId: data.email,
      providerId: CREDENTIAL_PROVIDER_ID,
      userId: userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    return createdUser;
  },

  /**
   * Check if any users exist in the database
   */
  async hasUsers(): Promise<boolean> {
    const [result] = await db
      .select()
      .from(user)
      .limit(USER_QUERY_LIMITS.EXISTS_CHECK);
    return !!result;
  },

  /**
   * Count total users
   */
  async count(): Promise<number> {
    const result = await db.select().from(user);
    return result.length;
  },

  /**
   * Delete user by ID (cascade will delete related data)
   */
  async delete(id: string): Promise<void> {
    await db.delete(user).where(eq(user.id, id));
  },

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string): Promise<boolean> {
    const [foundAccount] = await db
      .select()
      .from(account)
      .where(eq(account.accountId, email));

    if (!foundAccount?.password) {
      return false;
    }

    return verifyPassword(password, foundAccount.password);
  },
};
