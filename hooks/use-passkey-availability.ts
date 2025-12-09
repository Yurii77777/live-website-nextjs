import { useState, useEffect } from "react";
import { checkPasskeyAvailability } from "@/helpers/passkey";

/**
 * Custom hook to check if passkey authentication is available on this device
 * @returns boolean - true if passkey is available, false otherwise
 */
export function usePasskeyAvailability(): boolean {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      const available = await checkPasskeyAvailability();
      setIsAvailable(available);
    }

    checkAvailability();
  }, []);

  return isAvailable;
}
