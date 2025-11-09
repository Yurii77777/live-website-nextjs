import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b z-50 before:absolute before:inset-0 before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:opacity-20">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="text-xl font-bold text-white relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Magic WebLab
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
