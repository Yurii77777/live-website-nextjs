import { Config } from "@measured/puck";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Icon } from "@/components/ui/icon";

type Props = {
  Button: {
    id?: string;
    text: string;
    variant?: "default" | "primary" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
    className?: string;
  };
  Link: {
    id?: string;
    href: string;
    text: string;
    variant?: "inline" | "subtle" | "unstyled";
    asButton?: boolean;
    buttonVariant?: "default" | "primary" | "ghost";
    buttonSize?: "sm" | "md" | "lg" | "icon";
    className?: string;
  };
  Heading: {
    id?: string;
    text: string;
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "title" | "subtitle";
    align?: "left" | "center" | "right";
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
    className?: string;
  };
  Paragraph: {
    id?: string;
    text: string;
    variant?: "default" | "lead" | "small" | "muted" | "caption";
    align?: "left" | "center" | "right" | "justify";
    as?: "p" | "span" | "div";
    className?: string;
  };
  Icon: {
    id?: string;
    name:
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
    variant?: "default" | "inline";
    size?: number;
    className?: string;
  };
};

export const config: Config<Props> = {
  components: {
    Button: {
      fields: {
        text: { type: "text", label: "Text" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Primary", value: "primary" },
            { label: "Ghost", value: "ghost" },
          ],
        },
        size: {
          type: "select",
          label: "Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Icon", value: "icon" },
          ],
        },
        className: { type: "text", label: "Custom Classes (Tailwind)" },
      },
      defaultProps: {
        text: "Click me",
        variant: "default",
        size: "md",
        className: "",
      },
      render: ({ text, variant, size, className }) => {
        return (
          <Button variant={variant} size={size} className={className}>
            {text}
          </Button>
        );
      },
    },
    Link: {
      fields: {
        href: { type: "text", label: "URL" },
        text: { type: "text", label: "Link Text" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Inline", value: "inline" },
            { label: "Subtle", value: "subtle" },
            { label: "Unstyled", value: "unstyled" },
          ],
        },
        asButton: { type: "radio", label: "As Button", options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ] },
        buttonVariant: {
          type: "select",
          label: "Button Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Primary", value: "primary" },
            { label: "Ghost", value: "ghost" },
          ],
        },
        buttonSize: {
          type: "select",
          label: "Button Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Icon", value: "icon" },
          ],
        },
        className: { type: "text", label: "Custom Classes (Tailwind)" },
      },
      defaultProps: {
        href: "#",
        text: "Link",
        variant: "inline",
        asButton: false,
        className: "",
      },
      render: ({ href, text, variant, asButton, buttonVariant, buttonSize, className }) => {
        return (
          <Link
            href={href}
            variant={variant}
            asButton={asButton}
            buttonVariant={buttonVariant}
            buttonSize={buttonSize}
            className={className}
          >
            {text}
          </Link>
        );
      },
    },
    Heading: {
      fields: {
        text: { type: "text", label: "Text" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
            { label: "Title", value: "title" },
            { label: "Subtitle", value: "subtitle" },
          ],
        },
        align: {
          type: "radio",
          label: "Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        as: {
          type: "select",
          label: "HTML Tag",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
            { label: "P", value: "p" },
            { label: "Div", value: "div" },
          ],
        },
        className: { type: "text", label: "Custom Classes (Tailwind)" },
      },
      defaultProps: {
        text: "Heading",
        variant: "h1",
        align: "left",
        className: "",
      },
      render: ({ text, variant, align, as, className }) => {
        return (
          <Heading variant={variant} align={align} as={as} className={className}>
            {text}
          </Heading>
        );
      },
    },
    Paragraph: {
      fields: {
        text: { type: "textarea", label: "Text" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Lead", value: "lead" },
            { label: "Small", value: "small" },
            { label: "Muted", value: "muted" },
            { label: "Caption", value: "caption" },
          ],
        },
        align: {
          type: "radio",
          label: "Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
            { label: "Justify", value: "justify" },
          ],
        },
        as: {
          type: "select",
          label: "HTML Tag",
          options: [
            { label: "P", value: "p" },
            { label: "Span", value: "span" },
            { label: "Div", value: "div" },
          ],
        },
        className: { type: "text", label: "Custom Classes (Tailwind)" },
      },
      defaultProps: {
        text: "This is a paragraph text.",
        variant: "default",
        align: "left",
        as: "p",
        className: "",
      },
      render: ({ text, variant, align, as, className }) => {
        return (
          <Paragraph variant={variant} align={align} as={as} className={className}>
            {text}
          </Paragraph>
        );
      },
    },
    Icon: {
      fields: {
        name: {
          type: "select",
          label: "Icon",
          options: [
            { label: "Phone", value: "PhoneIcon" },
            { label: "Mail", value: "MailIcon" },
            { label: "Map Pin", value: "MapPinIcon" },
            { label: "Globe", value: "GlobeIcon" },
            { label: "Message Circle", value: "MessageCircleIcon" },
            { label: "Send", value: "SendIcon" },
            { label: "Calendar", value: "CalendarIcon" },
            { label: "Clock", value: "ClockIcon" },
            { label: "Dollar Sign", value: "DollarSignIcon" },
            { label: "Check Circle", value: "CheckCircleIcon" },
            { label: "Arrow Right", value: "ArrowRightIcon" },
            { label: "External Link", value: "ExternalLinkIcon" },
            { label: "Chevron Right", value: "ChevronRightIcon" },
            { label: "Circle Arrow Right", value: "CircleArrowRightIcon" },
            { label: "Move Right", value: "MoveRightIcon" },
          ],
        },
        variant: {
          type: "radio",
          label: "Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Inline", value: "inline" },
          ],
        },
        size: { type: "number", label: "Size (px)" },
        className: { type: "text", label: "Custom Classes (Tailwind)" },
      },
      defaultProps: {
        name: "PhoneIcon",
        variant: "inline",
        size: 16,
        className: "",
      },
      render: ({ name, variant, size, className }) => {
        return <Icon name={name} variant={variant} size={size} className={className} />;
      },
    },
  },
};
