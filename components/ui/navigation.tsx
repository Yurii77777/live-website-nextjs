import { cn } from "@/lib/utils";

export interface NavigationProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Navigation({ children, title, className }: NavigationProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {title && (
        <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </nav>
  );
}
