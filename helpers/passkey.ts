/**
 * Check if passkey authentication is available on this device
 * @returns Promise<boolean> - true if passkey is available, false otherwise
 */
export async function checkPasskeyAvailability(): Promise<boolean> {
  try {
    if (typeof window === "undefined") {
      return false;
    }

    if (!window.PublicKeyCredential) {
      return false;
    }

    const available =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

    return available;
  } catch (error) {
    console.error("Error checking passkey availability:", error);
    return false;
  }
}
