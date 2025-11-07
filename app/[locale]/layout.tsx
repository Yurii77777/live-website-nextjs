import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Live Website with AI",
  description: "AI-powered website builder with Puck Editor",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className="h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />

          <main className="flex-1 overflow-hidden">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
