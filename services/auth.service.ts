import { authClient } from "@/lib/auth-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { AUTH_ERROR_MESSAGES } from "@/constants/auth";
import type {
  SignInCredentials,
  SignUpCredentials,
  AuthSession,
} from "@/types/auth";

export const authService = {
  /**
   * Sign in with email and password
   */
  async signInWithEmail(credentials: SignInCredentials) {
    try {
      return await authClient.signIn.email(credentials);
    } catch (error) {
      console.error("Sign in failed:", error);
      throw new Error(AUTH_ERROR_MESSAGES.SIGN_IN_FAILED);
    }
  },

  /**
   * Sign up with email and password
   * Uses custom endpoint to automatically assign admin role to first user
   */
  async signUpWithEmail(credentials: SignUpCredentials) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGN_UP_WITH_ROLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Important: allows cookies to be set
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || AUTH_ERROR_MESSAGES.SIGN_UP_FAILED };
      }

      return { data };
    } catch (error) {
      console.error("Sign up failed:", error);
      throw new Error(AUTH_ERROR_MESSAGES.SIGN_UP_FAILED);
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      throw new Error(AUTH_ERROR_MESSAGES.SIGN_OUT_FAILED);
    }
  },

  /**
   * Get current session
   */
  async getSession(): Promise<AuthSession | null> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SESSION, {
        credentials: "include",
      });
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch (error) {
      console.error("Failed to fetch session:", error);
      return null;
    }
  },

  /**
   * Register a new passkey for current user
   */
  async registerPasskey(
    name?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await authClient.passkey.addPasskey({
        name,
        authenticatorAttachment: "platform", // Use Touch ID / Windows Hello
      });

      if (result.error) {
        console.error("Passkey registration error:", result.error);
        return {
          success: false,
          error: AUTH_ERROR_MESSAGES.PASSKEY_REGISTER_FAILED,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Passkey registration failed:", error);
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.PASSKEY_REGISTER_FAILED,
      };
    }
  },

  /**
   * Sign in with passkey
   */
  async signInWithPasskey() {
    try {
      return await authClient.signIn.passkey();
    } catch (error) {
      console.error("Passkey sign in failed:", error);
      throw new Error(AUTH_ERROR_MESSAGES.PASSKEY_SIGN_IN_FAILED);
    }
  },

  /**
   * List all passkeys for current user
   */
  async listPasskeys(): Promise<
    Array<{
      id: string;
      name: string | null;
      createdAt: Date;
    }>
  > {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.PASSKEY.LIST, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(AUTH_ERROR_MESSAGES.PASSKEY_LIST_FAILED);
      }
      return response.json();
    } catch (error) {
      console.error("Failed to list passkeys:", error);
      throw new Error(AUTH_ERROR_MESSAGES.PASSKEY_LIST_FAILED);
    }
  },

  /**
   * Delete a passkey
   */
  async deletePasskey(passkeyId: string): Promise<void> {
    try {
      const response = await fetch(
        API_ENDPOINTS.AUTH.PASSKEY.DELETE(passkeyId),
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(AUTH_ERROR_MESSAGES.PASSKEY_DELETE_FAILED);
      }
    } catch (error) {
      console.error("Failed to delete passkey:", error);
      throw new Error(AUTH_ERROR_MESSAGES.PASSKEY_DELETE_FAILED);
    }
  },

  /**
   * Check if any users exist in the system
   */
  async hasUsers(): Promise<{ hasUsers: boolean }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.HAS_USERS, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to check users");
      }
      return response.json();
    } catch (error) {
      console.error("Failed to check users:", error);
      throw error;
    }
  },
};
