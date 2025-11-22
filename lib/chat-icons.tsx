export {
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Send,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CircleArrowRight,
  MoveRight,
} from "lucide-react";

export const ChatIcons = {
  PhoneIcon: "Phone",
  MailIcon: "Mail",
  MapPinIcon: "MapPin",
  GlobeIcon: "Globe",
  MessageCircleIcon: "MessageCircle",
  SendIcon: "Send",
  CalendarIcon: "Calendar",
  ClockIcon: "Clock",
  DollarSignIcon: "DollarSign",
  CheckCircleIcon: "CheckCircle",
  ArrowRightIcon: "ArrowRight",
  ExternalLinkIcon: "ExternalLink",
  ChevronRightIcon: "ChevronRight",
  CircleArrowRightIcon: "CircleArrowRight",
  MoveRightIcon: "MoveRight",
} as const;

export type ChatIconName = keyof typeof ChatIcons;
