import { type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import * as Icons from "@/lib/chat-icons";

const iconMap = {
  PhoneIcon: Icons.Phone,
  MailIcon: Icons.Mail,
  MapPinIcon: Icons.MapPin,
  GlobeIcon: Icons.Globe,
  MessageCircleIcon: Icons.MessageCircle,
  SendIcon: Icons.Send,
  CalendarIcon: Icons.Calendar,
  ClockIcon: Icons.Clock,
  DollarSignIcon: Icons.DollarSign,
  CheckCircleIcon: Icons.CheckCircle,
  ArrowRightIcon: Icons.ArrowRight,
  ExternalLinkIcon: Icons.ExternalLink,
  ChevronRightIcon: Icons.ChevronRight,
  CircleArrowRightIcon: Icons.CircleArrowRight,
  MoveRightIcon: Icons.MoveRight,
} as const;

export type IconName = keyof typeof iconMap;

const iconVariants = cva("transition-all duration-200", {
  variants: {
    variant: {
      default: [
        "inline-flex items-center justify-center",
        "rounded-glass",
        "p-1.5",
        "backdrop-blur-glass-light [-webkit-backdrop-filter:blur(1px)]",
        "border border-white/20",
        "shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15)]",
        "bg-white/5",
        "text-foreground/80",
        "hover:bg-white/10 hover:border-white/30 hover:text-foreground",
        "hover:shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
      ],
      inline: "inline-block text-foreground/70",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, variant, size = 16, className }: IconProps) {
  const IconComponent = iconMap[name] as LucideIcon;

  return (
    <span className={twMerge(iconVariants({ variant }), className)}>
      <IconComponent size={size} />
    </span>
  );
}
