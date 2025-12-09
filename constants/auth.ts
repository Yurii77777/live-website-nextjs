export const AUTH_ERROR_MESSAGES = {
  SIGN_IN_FAILED: "auth.messages.signInFailed",
  SIGN_UP_FAILED: "auth.messages.signUpFailed",
  SIGN_OUT_FAILED: "auth.messages.signOutFailed",
  SESSION_FETCH_FAILED: "auth.messages.sessionFetchFailed",
  PASSKEY_REGISTER_FAILED: "auth.messages.passkeyRegisterFailed",
  PASSKEY_SIGN_IN_FAILED: "auth.messages.passkeySignInFailed",
  PASSKEY_LIST_FAILED: "auth.messages.passkeyListFailed",
  PASSKEY_DELETE_FAILED: "auth.messages.passkeyDeleteFailed",
  UNAUTHORIZED: "auth.messages.unauthorized",
  INVALID_CREDENTIALS: "auth.messages.invalidCredentials",
  EMAIL_ALREADY_EXISTS: "auth.messages.emailAlreadyExists",
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  SIGN_IN_SUCCESS: "auth.messages.signInSuccess",
  SIGN_UP_SUCCESS: "auth.messages.signUpSuccess",
  SIGN_OUT_SUCCESS: "auth.messages.signOutSuccess",
  PASSKEY_REGISTERED: "auth.messages.passkeyRegistered",
  PASSKEY_DELETED: "auth.messages.passkeyDeleted",
} as const;

export const AUTH_CONFIG = {
  SESSION_COOKIE_NAME: "better-auth.session_token",
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
} as const;

export const SALT_ROUNDS = 10;

export const PASSWORD_SECURITY = {
  HASH_ALGORITHM: "sha256",
} as const;

export const ID_GENERATION = {
  BASE: 36,
  RANDOM_START: 2,
  RANDOM_END: 15,
} as const;

export const CREDENTIAL_PROVIDER_ID = "credential";

export const USER_QUERY_LIMITS = {
  EXISTS_CHECK: 1,
} as const;

export const SESSION_CONFIG = {
  EXPIRES_IN: 60 * 60 * 24 * 7, // 7 days in seconds
  UPDATE_AGE: 60 * 60 * 24, // 1 day in seconds
  COOKIE_CACHE_MAX_AGE: 60 * 5, // 5 minutes in seconds
  HAS_USERS_STALE_TIME: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
} as const;

export const PASSKEY_CONFIG = {
  RP_NAME: "Live Website AI",
  AUTHENTICATOR_ATTACHMENT: "platform" as const,
  RESIDENT_KEY: "preferred" as const,
  USER_VERIFICATION: "preferred" as const,
} as const;

export const TRUSTED_ORIGINS = {
  LOCALHOST: "http://localhost:3000",
} as const;
