import { Config } from "@measured/puck";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Icon } from "@/components/ui/icon";
import { HeroTwoColumn } from "@/components/ui/hero-two-column";
import { HeroFlexibleGrid } from "@/components/ui/hero-flexible-grid";

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
  HeroTwoColumn: {
    id?: string;
    leftColumn: any[];
    rightColumn: any[];
    spacing?: "none" | "sm" | "md" | "lg" | "xl";
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    columns?: "1-1" | "2-1" | "1-2";
    className?: string;
    containerClassName?: string;
  };
  HeroFlexibleGrid: {
    id?: string;
    leftColumnRows?: "1" | "2";
    rightColumnRows?: "1" | "2";
    leftColumnTop: any[];
    leftColumnBottom: any[];
    rightColumnTop: any[];
    rightColumnBottom: any[];
    spacing?: "none" | "sm" | "md" | "lg" | "xl";
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    rowSpacing?: "none" | "sm" | "md" | "lg" | "xl";
    columns?: "1-1" | "2-1" | "1-2";
    className?: string;
    containerClassName?: string;
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
        asButton: {
          type: "radio",
          label: "As Button",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
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
      render: ({
        href,
        text,
        variant,
        asButton,
        buttonVariant,
        buttonSize,
        className,
      }) => {
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
          <Heading
            variant={variant}
            align={align}
            as={as}
            className={className}
          >
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
          <Paragraph
            variant={variant}
            align={align}
            as={as}
            className={className}
          >
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
        return (
          <Icon
            name={name}
            variant={variant}
            size={size}
            className={className}
          />
        );
      },
    },
    HeroTwoColumn: {
      fields: {
        leftColumn: {
          type: "slot",
          label: "Left Column",
        },
        rightColumn: {
          type: "slot",
          label: "Right Column",
        },
        spacing: {
          type: "select",
          label: "Column Spacing",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        padding: {
          type: "select",
          label: "Padding",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        columns: {
          type: "radio",
          label: "Column Ratio",
          options: [
            { label: "Equal (1:1)", value: "1-1" },
            { label: "Left Wider (2:1)", value: "2-1" },
            { label: "Right Wider (1:2)", value: "1-2" },
          ],
        },
        className: { type: "text", label: "Custom Classes (Tailwind)" },
        containerClassName: {
          type: "text",
          label: "Container Classes (Tailwind)",
        },
      },
      defaultProps: {
        leftColumn: [],
        rightColumn: [],
        spacing: "lg",
        padding: "md",
        columns: "1-1",
        className: "",
        containerClassName: "",
      },
      render: ({
        leftColumn: LeftColumn,
        rightColumn: RightColumn,
        spacing,
        padding,
        columns,
        className,
        containerClassName,
      }) => {
        return (
          <HeroTwoColumn
            leftColumn={<LeftColumn />}
            rightColumn={<RightColumn />}
            spacing={spacing}
            padding={padding}
            columns={columns}
            className={className}
            containerClassName={containerClassName}
          />
        );
      },
    },
    HeroFlexibleGrid: {
      fields: {
        leftColumnRows: {
          type: "radio",
          label: "Left Column Rows",
          options: [
            { label: "1 Row", value: "1" },
            { label: "2 Rows", value: "2" },
          ],
        },
        rightColumnRows: {
          type: "radio",
          label: "Right Column Rows",
          options: [
            { label: "1 Row", value: "1" },
            { label: "2 Rows", value: "2" },
          ],
        },
        leftColumnTop: {
          type: "slot",
          label: "Left Column - Top Row",
        },
        leftColumnBottom: {
          type: "slot",
          label: "Left Column - Bottom Row",
        },
        rightColumnTop: {
          type: "slot",
          label: "Right Column - Top Row",
        },
        rightColumnBottom: {
          type: "slot",
          label: "Right Column - Bottom Row",
        },
        spacing: {
          type: "select",
          label: "Column Spacing",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        rowSpacing: {
          type: "select",
          label: "Row Spacing",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        padding: {
          type: "select",
          label: "Padding",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        columns: {
          type: "radio",
          label: "Column Ratio",
          options: [
            { label: "Equal (1:1)", value: "1-1" },
            { label: "Left Wider (2:1)", value: "2-1" },
            { label: "Right Wider (1:2)", value: "1-2" },
          ],
        },
        className: { type: "text", label: "Custom Classes (Tailwind)" },
        containerClassName: {
          type: "text",
          label: "Container Classes (Tailwind)",
        },
      },
      defaultProps: {
        leftColumnRows: "1",
        rightColumnRows: "1",
        leftColumnTop: [],
        leftColumnBottom: [],
        rightColumnTop: [],
        rightColumnBottom: [],
        spacing: "lg",
        rowSpacing: "md",
        padding: "md",
        columns: "1-1",
        className: "",
        containerClassName: "",
      },
      render: ({
        leftColumnRows,
        rightColumnRows,
        leftColumnTop: LeftColumnTop,
        leftColumnBottom: LeftColumnBottom,
        rightColumnTop: RightColumnTop,
        rightColumnBottom: RightColumnBottom,
        spacing,
        rowSpacing,
        padding,
        columns,
        className,
        containerClassName,
      }) => {
        return (
          <HeroFlexibleGrid
            leftColumnRows={leftColumnRows}
            rightColumnRows={rightColumnRows}
            leftColumnTop={<LeftColumnTop />}
            leftColumnBottom={<LeftColumnBottom />}
            rightColumnTop={<RightColumnTop />}
            rightColumnBottom={<RightColumnBottom />}
            spacing={spacing}
            rowSpacing={rowSpacing}
            padding={padding}
            columns={columns}
            className={className}
            containerClassName={containerClassName}
          />
        );
      },
    },
  },
};
