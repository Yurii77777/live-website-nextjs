import type { Session, User } from "@/lib/auth";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name: string;
}

export interface AuthSession {
  user: User;
  session: Session;
}
