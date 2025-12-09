import { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <section className="w-full max-w-sm sm:max-w-md">
        <article className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 bg-gray-900 border-t border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-brand-gradient-overlay before:opacity-20">
          <header className="text-center space-y-1.5 sm:space-y-2 relative z-10">
            <Heading
              variant="h1"
              className="text-white text-xl sm:text-2xl md:text-display-sm font-semibold"
            >
              {title}
            </Heading>
            <Paragraph
              variant="muted"
              className="text-white/80 text-sm sm:text-base"
            >
              {subtitle}
            </Paragraph>
          </header>

          <div className="relative z-10">{children}</div>

          {footer && <div className="text-center relative z-10">{footer}</div>}
        </article>
      </section>
    </main>
  );
}
