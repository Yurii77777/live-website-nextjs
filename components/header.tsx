import { LanguageSwitcher } from "./language-switcher";
import { SiteMenu } from "./site-menu";
import { Link } from "@/i18n/routing";
import { COMPANY_INFO } from "@/constants";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-header-bg border-b z-50 before:absolute before:inset-0 before:bg-brand-gradient-overlay before:opacity-20">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-3 md:gap-6">
          <SiteMenu />
          <Link
            href="/"
            className="text-xl font-bold text-white relative z-10 bg-clip-text bg-brand-gradient-text hover:opacity-80 transition-opacity"
          >
            {COMPANY_INFO.name}
          </Link>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
