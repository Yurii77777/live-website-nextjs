import { cn } from "@/lib/utils";
import { Link } from "@/components/ui/link";
import { Icon } from "@/components/ui/icon";

export interface MenuItemProps {
  label: string;
  href: string;
  icon?:
    | "PhoneIcon"
    | "MailIcon"
    | "MapPinIcon"
    | "GlobeIcon"
    | "MessageCircleIcon"
    | "SendIcon"
    | "CalendarIcon"
    | "ClockIcon"
    | "DollarSignIcon"
    | "CheckCircleIcon"
    | "ArrowRightIcon"
    | "ExternalLinkIcon"
    | "ChevronRightIcon"
    | "CircleArrowRightIcon"
    | "MoveRightIcon";
  className?: string;
  onClick?: () => void;
}

export function MenuItem({
  label,
  href,
  icon,
  className,
  onClick,
}: MenuItemProps) {
  // Normalize href: add /p/ prefix for internal page slugs
  // - If starts with /, /p/, http://, https://, or # -> use as is
  // - Otherwise, treat as page slug and add /p/ prefix
  const normalizedHref = (() => {
    if (!href) return "/";

    // Already has /p/ prefix or is external/anchor
    if (
      href.startsWith("/p/") ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#")
    ) {
      return href;
    }

    // Root path or special paths
    if (href === "/" || href.startsWith("/admin")) {
      return href;
    }

    // Remove leading slash if present and add /p/ prefix
    const slug = href.startsWith("/") ? href.slice(1) : href;
    return `/p/${slug}`;
  })();

  return (
    <Link
      href={normalizedHref}
      variant="unstyled"
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
      onClick={onClick}
    >
      {icon && <Icon name={icon} variant="inline" size={20} />}
      <span className="text-base font-medium">{label}</span>
    </Link>
  );
}
