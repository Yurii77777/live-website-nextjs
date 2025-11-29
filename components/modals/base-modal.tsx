"use client";

import { useRouter } from "@/i18n/routing";
import { useEffect, useRef } from "react";

interface BaseModalProps {
  children: React.ReactNode;
}

export function BaseModal({ children }: BaseModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    // Close modal on ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [router]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      router.back();
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <aside
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-100"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <article
        onClick={handleModalClick}
        className={[
          "relative rounded-3xl p-6 max-w-md w-full",
          "bg-gray-900",
          "border-t border-white/10",
          "shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
          "before:bg-brand-gradient-overlay before:opacity-20",
          "relative z-10 text-white",
        ].join(" ")}
      >
        {children}
      </article>
    </aside>
  );
}
