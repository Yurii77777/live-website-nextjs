import {
  pgTable,
  text,
  vector,
  timestamp,
  json,
  boolean,
  index,
  integer,
} from "drizzle-orm/pg-core";
import { UserRole } from "@/types/auth";

export const pages = pgTable("page", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => {
      return `c${Date.now().toString(36)}${Math.random().toString(36).substring(2, 15)}`;
    }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  content: json("content").notNull(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const knowledgeBase = pgTable(
  "knowledge_base",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return `c${Date.now().toString(36)}${Math.random().toString(36).substring(2, 15)}`;
      }),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    metadata: json("metadata"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  role: text("role").notNull().default(UserRole.USER),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const passkey = pgTable("passkey", {
  id: text("id").primaryKey(),
  name: text("name"),
  publicKey: text("publicKey").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  credentialID: text("credentialID").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("deviceType").notNull(),
  backedUp: boolean("backedUp").notNull(),
  transports: text("transports"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  aaguid: text("aaguid"),
});

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type NewKnowledgeBase = typeof knowledgeBase.$inferInsert;
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Passkey = typeof passkey.$inferSelect;
