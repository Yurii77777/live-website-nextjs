import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Link, type LinkProps } from "@/components/ui/link";
import { Heading, type HeadingProps } from "@/components/ui/heading";
import { Paragraph, type ParagraphProps } from "@/components/ui/paragraph";
import { Icon, type IconName } from "@/components/ui/icon";
import { ChatIcons } from "@/lib/chat-icons";

interface AIMessageRendererProps {
  content: string;
}

type ParsedProps = Record<string, string | boolean>;

export function AIMessageRenderer({ content }: AIMessageRendererProps) {
  const isValidIconName = (value: string): value is IconName => {
    return value in ChatIcons;
  };

  const isValidLinkVariant = (
    value: string
  ): value is NonNullable<LinkProps["variant"]> => {
    return ["inline", "subtle", "unstyled"].includes(value);
  };

  const isValidButtonVariant = (
    value: string
  ): value is NonNullable<ButtonProps["variant"]> => {
    return ["default", "destructive", "outline", "ghost"].includes(value);
  };

  const isValidButtonSize = (
    value: string
  ): value is NonNullable<ButtonProps["size"]> => {
    return ["default", "sm", "lg", "icon"].includes(value);
  };

  const isValidHeadingVariant = (
    value: string
  ): value is NonNullable<HeadingProps["variant"]> => {
    return ["h1", "h2", "h3", "h4", "h5", "h6", "title", "subtitle"].includes(
      value
    );
  };

  const isValidParagraphVariant = (
    value: string
  ): value is NonNullable<ParagraphProps["variant"]> => {
    return ["default", "lead", "small", "muted", "caption"].includes(value);
  };

  const isValidHeadingAlign = (
    value: string
  ): value is "left" | "center" | "right" => {
    return ["left", "center", "right"].includes(value);
  };

  const isValidParagraphAlign = (
    value: string
  ): value is "left" | "center" | "right" | "justify" => {
    return ["left", "center", "right", "justify"].includes(value);
  };

  const isValidHeadingAs = (
    value: string
  ): value is NonNullable<HeadingProps["as"]> => {
    return ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"].includes(value);
  };

  const isValidParagraphAs = (
    value: string
  ): value is NonNullable<ParagraphProps["as"]> => {
    return ["p", "span", "div"].includes(value);
  };

  const parseInlineContent = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Regex for inline elements, icons, and inline Links
    const inlineRegex =
      /<(strong|b|em|i|code|u)>(.*?)<\/\1>|<Icon\s+name=["'](\w+)["']\s*(?:size=["'](\d+)["'])?\s*(?:variant=["'](\w+)["'])?\s*\/>|<Link\s+href=["']([^"']+)["']\s*(?:variant=["'](\w+)["'])?\s*>(.*?)<\/Link>/gs;

    let match;
    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        const textBefore = text.slice(currentIndex, match.index);
        nodes.push(
          <React.Fragment key={`text-${key++}`}>{textBefore}</React.Fragment>
        );
      }

      // If this is an inline Link
      if (match[6]) {
        const href = match[6];
        const variant =
          match[7] && isValidLinkVariant(match[7]) ? match[7] : undefined;
        const linkContent = match[8];

        nodes.push(
          <Link key={`inline-link-${key++}`} href={href} variant={variant}>
            {linkContent}
          </Link>
        );
      }
      // If this is an icon
      else if (match[3]) {
        const iconName = match[3];
        const iconSize = match[4] ? parseInt(match[4], 10) : 16;
        const iconVariant = match[5] === "default" ? "default" : "inline";

        if (isValidIconName(iconName)) {
          nodes.push(
            <Icon
              key={`icon-${key++}`}
              name={iconName}
              size={iconSize}
              variant={iconVariant}
              className="align-text-bottom"
            />
          );
        }
      } else {
        // Regular inline elements
        const [fullMatch, tagName, content] = match;

        switch (tagName) {
          case "strong":
          case "b":
            nodes.push(<strong key={`strong-${key++}`}>{content}</strong>);
            break;
          case "em":
          case "i":
            nodes.push(<em key={`em-${key++}`}>{content}</em>);
            break;
          case "code":
            nodes.push(
              <code
                key={`code-${key++}`}
                className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
              >
                {content}
              </code>
            );
            break;
          case "u":
            nodes.push(<u key={`u-${key++}`}>{content}</u>);
            break;
        }
      }

      currentIndex = match.index + match[0].length;
    }

    if (currentIndex < text.length) {
      const textAfter = text.slice(currentIndex);
      nodes.push(
        <React.Fragment key={`text-${key++}`}>{textAfter}</React.Fragment>
      );
    }

    return nodes.length > 0 ? nodes : [text];
  };

  const parseListContent = (listHtml: string): React.ReactNode[] => {
    const items: React.ReactNode[] = [];
    const liRegex = /<li>(.*?)<\/li>/gs;
    let key = 0;

    let match;
    while ((match = liRegex.exec(listHtml)) !== null) {
      const content = match[1];
      items.push(
        <li key={`li-${key++}`} className="flex items-start gap-2 mb-2">
          <Icon
            name="ChevronRightIcon"
            size={16}
            className="mt-1 shrink-0 text-primary"
          />
          <span className="flex-1">{parseInlineContent(content)}</span>
        </li>
      );
    }

    return items;
  };

  const parseContent = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    const componentRegex =
      /<(Link|Button|Heading|Paragraph|ul)([^>]*)>(.*?)<\/\1>/gs;

    let match;
    while ((match = componentRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        const textBefore = text.slice(currentIndex, match.index);
        if (textBefore.trim()) {
          nodes.push(
            <span key={`text-${key++}`}>{parseInlineContent(textBefore)}</span>
          );
        }
      }

      const [fullMatch, componentName, propsString, children] = match;
      const props = parseProps(propsString);

      switch (componentName) {
        case "Link": {
          const href = typeof props.href === "string" ? props.href : "";
          const variant =
            typeof props.variant === "string" &&
            isValidLinkVariant(props.variant)
              ? props.variant
              : undefined;
          const asButton = props.asButton === true;
          const buttonVariant =
            typeof props.buttonVariant === "string" &&
            isValidButtonVariant(props.buttonVariant)
              ? props.buttonVariant
              : undefined;
          const buttonSize =
            typeof props.buttonSize === "string" &&
            isValidButtonSize(props.buttonSize)
              ? props.buttonSize
              : undefined;

          nodes.push(
            <Link
              key={`link-${key++}`}
              href={href}
              variant={variant}
              asButton={asButton}
              buttonVariant={buttonVariant}
              buttonSize={buttonSize}
              className={
                asButton
                  ? "bg-gray-900 relative isolate before:absolute before:inset-0 before:z-0 before:rounded-glass before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:opacity-20"
                  : undefined
              }
            >
              {parseInlineContent(children)}
            </Link>
          );
          break;
        }
        case "Button": {
          const variant =
            typeof props.variant === "string" &&
            isValidButtonVariant(props.variant)
              ? props.variant
              : undefined;
          const size =
            typeof props.size === "string" && isValidButtonSize(props.size)
              ? props.size
              : undefined;

          nodes.push(
            <Button
              key={`button-${key++}`}
              variant={variant}
              size={size}
              className="bg-gray-900 relative isolate before:absolute before:inset-0 before:z-0 before:rounded-glass before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:opacity-20"
            >
              {parseInlineContent(children)}
            </Button>
          );
          break;
        }
        case "Heading": {
          const variant =
            typeof props.variant === "string" &&
            isValidHeadingVariant(props.variant)
              ? props.variant
              : undefined;
          const align =
            typeof props.align === "string" && isValidHeadingAlign(props.align)
              ? props.align
              : undefined;
          const as =
            typeof props.as === "string" && isValidHeadingAs(props.as)
              ? props.as
              : undefined;

          nodes.push(
            <Heading
              key={`heading-${key++}`}
              variant={variant}
              align={align}
              as={as}
            >
              {parseInlineContent(children)}
            </Heading>
          );
          break;
        }
        case "Paragraph": {
          const variant =
            typeof props.variant === "string" &&
            isValidParagraphVariant(props.variant)
              ? props.variant
              : undefined;
          const align =
            typeof props.align === "string" &&
            isValidParagraphAlign(props.align)
              ? props.align
              : undefined;
          const as =
            typeof props.as === "string" && isValidParagraphAs(props.as)
              ? props.as
              : undefined;

          nodes.push(
            <Paragraph
              key={`paragraph-${key++}`}
              variant={variant}
              align={align}
              as={as}
            >
              {parseInlineContent(children)}
            </Paragraph>
          );
          break;
        }
        case "ul": {
          nodes.push(
            <ul key={`ul-${key++}`} className="space-y-2 my-4">
              {parseListContent(children)}
            </ul>
          );
          break;
        }
      }

      currentIndex = match.index + fullMatch.length;
    }

    if (currentIndex < text.length) {
      const textAfter = text.slice(currentIndex);
      if (textAfter.trim()) {
        nodes.push(
          <span key={`text-${key++}`}>{parseInlineContent(textAfter)}</span>
        );
      }
    }

    return nodes.length > 0 ? nodes : [text];
  };

  const parseProps = (propsString: string): ParsedProps => {
    const props: ParsedProps = {};
    const attrRegex = /(\w+)=["']([^"']*)["']|(\w+)(?=\s|$)/g;

    let match;
    while ((match = attrRegex.exec(propsString)) !== null) {
      if (match[1]) {
        props[match[1]] = match[2];
      } else if (match[3]) {
        props[match[3]] = true;
      }
    }

    return props;
  };

  return <div className="space-y-3">{parseContent(content)}</div>;
}
